import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import ts from 'typescript';
import { generateApi } from './docs.mjs';
import { generateMcpContent } from './mcp-content.mjs';

const output = 'dist/@ngx-formly/mcp';
const root = JSON.parse(readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(readFileSync('src/mcp/package.json', 'utf8'));
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, '.');
const entry = 'src/mcp/src/index.ts';
const program = ts.createProgram([entry], {
  ...options,
  types: ['node'],
  declaration: true,
  emitDeclarationOnly: true,
});
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => '\n',
    }),
  );
}
const emitted = program.emit(program.getSourceFile(entry), (_, content) =>
  writeFileSync(`${output}/index.d.ts`, content),
);
if (emitted.emitSkipped) throw new Error('MCP declaration generation failed.');

await build({
  entryPoints: [entry],
  outfile: `${output}/index.js`,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  packages: 'external',
  define: {
    __FORMLY_VERSION__: JSON.stringify(root.version),
    __FORMLY_REVISION__: JSON.stringify(revision),
    __FORMLY_MCP_CONTENT__: JSON.stringify(await generateMcpContent(generateApi())),
  },
});
writeFileSync(
  `${output}/package.json`,
  JSON.stringify(
    {
      ...manifest,
      version: root.version,
      repository: root.repository,
      homepage: root.homepage,
      bugs: root.bugs,
    },
    null,
    2,
  ) + '\n',
);
copyFileSync('src/mcp/README.md', `${output}/README.md`);
copyFileSync('LICENSE', `${output}/LICENSE`);

await build({
  entryPoints: ['demo/functions/mcp.ts'],
  outfile: 'dist/functions/mcp.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  packages: 'external',
  define: {
    __FORMLY_DEPLOY_URLS__: JSON.stringify(
      [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL].filter(Boolean),
    ),
  },
});
console.log(`Built @ngx-formly/mcp ${root.version} (${revision.slice(0, 8)}).`);
