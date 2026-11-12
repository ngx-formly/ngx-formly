import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import ts from 'typescript';
import { Slugger } from 'marked';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const localPath = (path) => relative(root, path).replaceAll('\\', '/');
const parse = (path) => ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true);
const property = (node, name) =>
  node.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText().replace(/['"]/g, '') === name)
    ?.initializer;

function literal(node) {
  if (node && ts.isStringLiteralLike(node)) return node.text;
  throw new Error(`Expected static text in MCP content: ${node?.getText()}`);
}

function rawImports(source) {
  return new Map(
    source.statements
      .filter((node) => ts.isImportDeclaration(node) && node.moduleSpecifier.text.endsWith('?raw'))
      .map((node) => [
        node.importClause.name.text,
        localPath(resolve(dirname(source.fileName), node.moduleSpecifier.text.slice(0, -4))),
      ]),
  );
}

// Use the website's exporter without loading its Angular components or running demo code.
async function exampleExporter() {
  const result = await build({
    entryPoints: [resolve(root, 'demo/src/app/shared/example-viewer/utils.ts')],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
    plugins: [
      {
        name: 'demo-raw-sources',
        setup(builder) {
          builder.onResolve({ filter: /\?raw$/ }, ({ path, resolveDir }) => ({
            path: resolve(resolveDir, path.slice(0, -4)),
            namespace: 'demo-source',
          }));
          builder.onLoad({ filter: /.*/, namespace: 'demo-source' }, ({ path }) => ({
            contents: read(path),
            loader: 'text',
          }));
        },
      },
    ],
  });
  return (await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`))
    .getExampleFiles;
}

export async function generateMcpContent(apiPages = JSON.parse(read('demo/src/app/api/api.generated.json'))) {
  const entries = [];
  const guides = parse(resolve(root, 'demo/src/app/guides/guides.content.ts'));
  const imports = rawImports(guides);
  const declaration = guides.statements
    .filter(ts.isVariableStatement)
    .flatMap((node) => node.declarationList.declarations)
    .find((node) => node.name.getText() === 'GUIDE_CONTENTS');
  for (const item of declaration.initializer.properties) {
    const name = item.name.getText().replace(/['"]/g, '');
    const source = imports.get(item.initializer.getText());
    if (!source) throw new Error(`Missing guide source: ${name}`);
    const content = read(source);
    const id = `guide/${/^v\d+$/.test(name) ? 'migration/' : ''}${name}`;
    entries.push({ id, kind: 'guide', title: content.match(/^# (.+)$/m)?.[1] || name, source, content });
  }

  for (const page of apiPages) {
    const id = page.path.slice(1);
    entries.push({ id, kind: 'api', title: page.title, source: page.source, content: page.content });
    const headings = [...page.content.matchAll(/^### (.+)$/gm)];
    const slugger = new Slugger();
    for (const [index, heading] of headings.entries()) {
      const content = page.content.slice(heading.index, headings[index + 1]?.index).replace(/\n## [^\n]+\s*$/, '');
      entries.push({
        id: `${id}#${slugger.slug(heading[1])}`,
        kind: 'api',
        title: heading[1],
        source: page.source,
        content: `# ${page.title}\n\n${content.trim()}`,
      });
    }
  }

  const getExampleFiles = await exampleExporter();
  for (const directory of ['examples', 'ui']) {
    const paths = ts.sys
      .readDirectory(resolve(root, `demo/src/app/${directory}`), ['.ts'], undefined, [
        '**/app.routes.ts',
        '**/index.ts',
      ])
      .sort();
    for (const path of paths) {
      const sourceFile = parse(path);
      const sources = rawImports(sourceFile);
      function visit(node) {
        if (ts.isObjectLiteralExpression(node) && property(node, 'files')) {
          const title = literal(property(node, 'title'));
          const description = property(node, 'description') ? literal(property(node, 'description')) : '';
          const files = property(node, 'files');
          if (!ts.isArrayLiteralExpression(files)) throw new Error(`Expected an example file list in ${path}`);
          const data = {
            title,
            description,
            files: files.elements.map((file) => {
              const source = sources.get(property(file, 'filecontent')?.getText());
              if (!source) throw new Error(`Missing example source in ${path}: ${file.getText()}`);
              return { file: literal(property(file, 'file')), filecontent: read(source) };
            }),
            deps: property(node, 'deps')?.elements.map(literal) || [],
          };
          const id = localPath(dirname(path))
            .replace('demo/src/app/', '')
            .replace('/ui-', '/')
            .replace('ui/common/', 'ui/bootstrap/');
          const theme = directory === 'ui' ? id.split('/')[1] : undefined;
          if (theme === 'bootstrap') {
            for (const file of ['app.config.ts', 'additional-types.component.ts']) {
              data.files.push({ file, filecontent: read(`demo/src/app/ui/ui-bootstrap/${file}`) });
            }
          }
          const exported = getExampleFiles(theme, data);
          // The favicon is binary decoration, not example source.
          delete exported.files['favicon.ico'];
          entries.push({
            id,
            kind: 'example',
            title,
            source: localPath(path),
            url: `https://formly.dev/${directory === 'ui' ? `ui/${theme || 'bootstrap'}` : id}`,
            content: description
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim(),
            files: exported.files,
          });
          return;
        }
        ts.forEachChild(node, visit);
      }
      visit(sourceFile);
    }
  }
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate MCP content ID: ${entry.id}`);
    ids.add(entry.id);
    entry.url ??= `https://formly.dev/${entry.id}`;
  }
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}
