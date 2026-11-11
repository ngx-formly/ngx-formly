import { fromJsonSchema, McpServer } from '@modelcontextprotocol/server';

interface ContentEntry {
  id: string;
  kind: 'guide' | 'api' | 'example';
  title: string;
  source: string;
  url: string;
  content: string;
  files?: Record<string, string>;
}

declare const __FORMLY_MCP_CONTENT__: ContentEntry[];

const entries = __FORMLY_MCP_CONTENT__;
const index = entries.map((entry) => ({
  entry,
  title: `${entry.id} ${entry.title}`.toLowerCase(),
  text: `${entry.content} ${Object.values(entry.files || {}).join(' ')}`.toLowerCase(),
}));
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const pagination = {
  limit: { type: 'integer', minimum: 1, maximum: 20, description: 'Maximum results, default 10.' },
  offset: { type: 'integer', minimum: 0, description: 'Results to skip, default 0.' },
};
const error = (text: string) => ({ isError: true, content: [{ type: 'text' as const, text }] });

export function registerContentTools(server: McpServer, version: string, revision: string) {
  const sourceRef = revision === 'development' ? 'main' : revision;
  const summary = (entry: ContentEntry) => ({
    id: entry.id,
    kind: entry.kind,
    title: entry.title,
    url: entry.url,
    sourceUrl: `https://github.com/ngx-formly/ngx-formly/blob/${sourceRef}/${entry.source}`,
  });
  const result = (data: Record<string, unknown>) => {
    const output = { ...data, version, revision };
    return { structuredContent: output, content: [{ type: 'text' as const, text: JSON.stringify(output) }] };
  };
  const list = (matches: ContentEntry[], offset = 0, limit = 10) =>
    result({
      results: matches.slice(offset, offset + limit).map(summary),
      total: matches.length,
      nextOffset: offset + limit < matches.length ? offset + limit : null,
    });

  server.registerTool(
    'formly_search',
    {
      title: 'Search Formly documentation and examples',
      description:
        'Keyword search across bundled guides, API symbols and demo source. Returns IDs for formly_lookup or formly_examples. Content matches the MCP build version, not necessarily your installed Formly version.',
      inputSchema: fromJsonSchema<{ query: string; kind?: ContentEntry['kind']; limit?: number; offset?: number }>({
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 200 },
          kind: { enum: ['guide', 'api', 'example'] },
          ...pagination,
        },
        required: ['query'],
        additionalProperties: false,
      }),
      annotations,
    },
    ({ query, kind, offset, limit }) => {
      const tokens = [...new Set(query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])];
      if (!tokens.length) return error('Provide at least one word to search for.');
      const matches = index
        .filter(({ entry }) => !kind || entry.kind === kind)
        .map(({ entry, title, text }) => ({
          entry,
          score: tokens.reduce(
            (score, token) => score + (title.includes(token) ? 10 : text.includes(token) ? 1 : 0),
            0,
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
        .map(({ entry }) => entry);
      return list(matches, offset, limit);
    },
  );

  server.registerTool(
    'formly_lookup',
    {
      title: 'Read a Formly guide or API reference',
      description:
        'Read a guide, package reference, or API symbol. Use an exact ID from formly_search, such as guide/validation or api/core#formlyfieldconfig. A unique title or symbol name also works. Use formly_examples for demo source.',
      inputSchema: fromJsonSchema<{ topic: string }>({
        type: 'object',
        properties: { topic: { type: 'string', minLength: 1, maxLength: 200 } },
        required: ['topic'],
        additionalProperties: false,
      }),
      annotations,
    },
    ({ topic }) => {
      const name = topic.trim().replace(/^\//, '').toLowerCase();
      const docs = entries.filter((entry) => entry.kind !== 'example');
      const exact = docs.find((entry) => entry.id.toLowerCase() === name);
      const matches = exact ? [exact] : docs.filter((entry) => entry.title.toLowerCase() === name);
      if (!matches.length) return error('Topic not found. Use formly_search to find a guide or API ID.');
      if (matches.length > 1) {
        return error(`Topic is ambiguous. Use one of these IDs: ${matches.map((entry) => entry.id).join(', ')}`);
      }
      const entry = matches[0];
      return result({
        ...summary(entry),
        content: entry.content.replaceAll(
          '/ngx-formly/ngx-formly/blob/main/',
          `/ngx-formly/ngx-formly/blob/${sourceRef}/`,
        ),
      });
    },
  );

  server.registerTool(
    'formly_examples',
    {
      title: 'List or retrieve Formly demo source',
      description:
        'Omit id to list examples with pagination, or provide an exact example ID from formly_search to retrieve its project files. Uses the website export with provider setup, custom types, assets and dependencies. UI examples use their named adapter; other examples use the demo default. Returns source only; never runs it.',
      inputSchema: fromJsonSchema<{ id?: string; limit?: number; offset?: number }>({
        type: 'object',
        properties: { id: { type: 'string', minLength: 1, maxLength: 200 }, ...pagination },
        additionalProperties: false,
      }),
      annotations,
    },
    ({ id, offset, limit }) => {
      const examples = entries.filter((entry) => entry.kind === 'example');
      if (id === undefined) return list(examples, offset, limit);
      const entry = examples.find((example) => example.id === id.trim().replace(/^\//, ''));
      if (!entry)
        return error('Example not found. Omit id to list examples, or use formly_search with kind="example".');
      return result({ ...summary(entry), description: entry.content, files: entry.files });
    },
  );
}
