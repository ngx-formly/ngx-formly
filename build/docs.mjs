import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const typeFlags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const code = (value) => `\`\`\`ts\n${value}\n\`\`\``;
const cell = (value) => value.replace(/\|/g, '&#124;').replace(/\r?\n/g, '<br>');
const inline = (value) => `<code>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
const publicSymbol = (symbol) =>
  !/^(?:_|ɵ|prototype$)/.test(symbol.name) &&
  !symbol.getJsDocTags().some((tag) => tag.name === 'internal') &&
  !symbol.declarations?.some((node) => ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private);

export function generateApi() {
  const entries = ts.sys.readDirectory(resolve(root, 'src'), ['.ts'], undefined, ['**/public_api.ts']).sort();
  const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const program = ts.createProgram(entries, options);
  const checker = program.getTypeChecker();
  const describe = (symbol) => {
    const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker));
    const tags = symbol
      .getJsDocTags(checker)
      .filter((tag) => ['deprecated', 'default', 'defaultValue', 'example'].includes(tag.name))
      .map((tag) => `**${tag.name}:** ${ts.displayPartsToString(tag.text)}`);
    return [comment, ...tags].filter(Boolean).join('\n\n');
  };
  const typeOf = (symbol, declaration) =>
    checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, declaration), declaration, typeFlags);

  const pages = entries.map((entry) => {
    const packagePath = relative(resolve(root, 'src'), entry)
      .replaceAll('\\', '/')
      .replace(/\/src\/public_api\.ts$/, '');
    const path = `/api/${packagePath}`;
    const packageName = `@ngx-formly/${packagePath.replace(/^ui\//, '')}`;
    if (process.argv.includes('--verbose')) console.log(`Documenting ${packageName}`);
    const sourceFile = program.getSourceFile(entry);
    const exports = checker
      .getExportsOfModule(checker.getSymbolAtLocation(sourceFile))
      .filter(publicSymbol)
      .map((symbol) => ({
        name: symbol.name,
        symbol: symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol,
        exported: true,
      }));
    const symbols = [...exports];
    // Include named supporting types so field/configuration references can be looked up on the same page.
    for (const { symbol } of exports) {
      for (const node of symbol.declarations?.[0]?.getSourceFile().statements || []) {
        if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name) {
          const support = checker.getSymbolAtLocation(node.name);
          if (publicSymbol(support) && !symbols.some((item) => item.name === support.name)) {
            symbols.push({ name: support.name, symbol: support, exported: false });
          }
        }
      }
    }

    const sections = symbols
      .sort((a, b) => Number(b.exported) - Number(a.exported) || a.name.localeCompare(b.name))
      .map(({ name, symbol, exported }) => {
        const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
        if (!declaration) throw new Error(`No declaration for ${packageName}: ${name}`);
        const file = declaration.getSourceFile();
        const source = relative(root, file.fileName).replaceAll('\\', '/');
        const line = file.getLineAndCharacterOfPosition(declaration.getStart()).line + 1;
        if (process.argv.includes('--verbose')) console.log(`  ${name}`);
        const parts = [
          `### ${name}`,
          exported ? code(`import { ${name} } from '${packageName}';`) : 'Supporting type used by this entry point.',
          describe(symbol),
        ];
        if (ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) {
          const decorators = ts.canHaveDecorators(declaration) ? ts.getDecorators(declaration) || [] : [];
          for (const decorator of decorators) {
            if (!ts.isCallExpression(decorator.expression)) continue;
            const metadata = decorator.expression.arguments[0];
            if (!metadata || !ts.isObjectLiteralExpression(metadata)) continue;
            const selector = metadata.properties.find((property) => property.name?.getText() === 'selector');
            if (selector && ts.isPropertyAssignment(selector))
              parts.push(`Selector: ${inline(selector.initializer.getText())}`);
          }
          const instance = checker.getDeclaredTypeOfSymbol(symbol);
          const statics = ts.isClassDeclaration(declaration)
            ? checker
                .getTypeOfSymbolAtLocation(symbol, declaration)
                .getProperties()
                .filter((member) => member.name !== 'prototype')
            : [];
          const members = [...instance.getProperties(), ...statics].filter(publicSymbol);
          if (members.length) {
            parts.push('| Member | Type | Description |\n| --- | --- | --- |');
            for (const member of members) {
              const node = member.valueDeclaration || member.declarations?.[0];
              if (!node) continue;
              const annotations = (ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [])
                .map((decorator) => decorator.expression.getText())
                .filter((text) => /^(Input|Output)\(/.test(text));
              const prefix = statics.includes(member) ? 'static ' : '';
              const optional = member.flags & ts.SymbolFlags.Optional ? '?' : '';
              parts.push(
                `| ${inline(`${prefix}${member.name}${optional}`)} | ${cell(inline(typeOf(member, node)))} | ${cell([annotations.map(inline).join(' '), describe(member)].filter(Boolean).join(' '))} |`,
              );
            }
          }
        } else if (ts.isTypeAliasDeclaration(declaration)) {
          parts.push(code(declaration.getText()));
        } else if (!checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures().length) {
          parts.push(code(`const ${name}: ${typeOf(symbol, declaration)};`));
        }
        parts.push(`[View source](https://github.com/ngx-formly/ngx-formly/blob/main/${source}#L${line})`);
        const decorators = (ts.canHaveDecorators(declaration) ? ts.getDecorators(declaration) || [] : []).map(
          (decorator) => (ts.isCallExpression(decorator.expression) ? decorator.expression.expression.getText() : ''),
        );
        const angularCategories = {
          NgModule: 'Modules',
          Component: 'Components',
          Directive: 'Directives',
          Pipe: 'Pipes',
          Injectable: 'Services',
        };
        const category = ts.isInterfaceDeclaration(declaration)
          ? 'Interfaces'
          : ts.isTypeAliasDeclaration(declaration)
            ? 'Types'
            : ts.isClassDeclaration(declaration)
              ? decorators.map((name) => angularCategories[name]).find(Boolean) || 'Classes'
              : checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures().length
                ? 'Functions'
                : 'Constants';
        return {
          category,
          content: parts
            .filter(Boolean)
            .join('\n\n')
            .replace(/\|\n\n(?=\|)/g, '|\n'),
        };
      });
    const categories = [
      'Functions',
      'Modules',
      'Components',
      'Directives',
      'Pipes',
      'Services',
      'Classes',
      'Interfaces',
      'Types',
      'Constants',
    ];
    const content = categories
      .flatMap((category) => {
        const entries = sections.filter((section) => section.category === category);
        return entries.length ? [`## ${category}`, ...entries.map((entry) => entry.content)] : [];
      })
      .join('\n\n');
    return {
      path,
      title: packageName,
      source: relative(root, entry).replaceAll('\\', '/'),
      content: `# ${packageName}\n\nAPI reference for this package entry point.\n\n${content}`,
    };
  });

  const schema = JSON.parse(readFileSync(resolve(root, 'src/schematics/src/ng-add/schema.json'), 'utf8'));
  pages.push({
    path: '/api/schematics',
    title: '@ngx-formly/schematics',
    source: 'src/schematics/src/ng-add/schema.json',
    content:
      '# @ngx-formly/schematics\n\n## ng-add\n\nInstall and configure Formly with the Angular CLI.\n\n```sh\nng add @ngx-formly/schematics --ui-theme=bootstrap\n```\n\n| Option | Type | Default | Description |\n| --- | --- | --- | --- |\n' +
      Object.entries(schema.properties)
        .map(
          ([name, option]) =>
            `| ${inline(name)} | ${cell(inline(option.enum ? option.enum.map((value) => JSON.stringify(value)).join(' | ') : option.type))} | ${option.default === undefined ? '' : inline(JSON.stringify(option.default))} | ${cell(option.description || '')} |`,
        )
        .join('\n'),
  });
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}

export function apiMenu(pages) {
  const groups = new Map();
  for (const page of pages) {
    const segments = page.path.split('/');
    const groupPath = segments.slice(0, segments[2] === 'ui' ? 4 : 3).join('/');
    const labels = {
      core: 'Core',
      schematics: 'Schematics',
      bootstrap: 'Bootstrap',
      material: 'Material',
      ionic: 'Ionic',
      kendo: 'Kendo',
      nativescript: 'NativeScript',
      'ng-zorro-antd': 'NG-ZORRO',
      primeng: 'PrimeNG',
      'json-schema': 'JSON Schema',
    };
    const label = labels[groupPath.split('/').at(-1)];
    if (!groups.has(groupPath)) groups.set(groupPath, { path: groupPath, label, items: [] });
    const name = segments.at(-1);
    groups.get(groupPath).items.push({
      path: page.path,
      label:
        page.path === groupPath
          ? label
          : labels[name] ||
            name
              .split('-')
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(' '),
    });
  }
  return [...groups.values()];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pages = generateApi();
  for (const [file, content] of [
    ['demo/src/app/api/api.generated.json', pages],
    ['demo/src/app/api/api-menu.generated.json', apiMenu(pages)],
  ]) {
    const serialized = `${JSON.stringify(content, null, 2)}\n`;
    const target = resolve(root, file);
    if (process.argv.includes('--check')) {
      if (readFileSync(target, 'utf8') !== serialized) throw new Error(`${file} is stale. Run npm run docs:api.`);
    } else {
      writeFileSync(target, serialized);
    }
  }
  console.log(
    `API documentation ${process.argv.includes('--check') ? 'checked' : 'generated'} for ${pages.length} entry points.`,
  );
}
