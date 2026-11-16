import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { createFormlyMcpHandler } from './index';
import { MAX_SOURCE_BYTES } from './validate-fields';
import * as validation from '../../validation/validate-formly-json';
import { locateDiagnostics } from '../../validation/diagnostic-location';

describe('Formly MCP over Streamable HTTP', () => {
  const endpoint = 'https://formly.test/mcp';
  let handler: ReturnType<typeof createFormlyMcpHandler>;
  let client: Client;

  beforeEach(() => {
    handler = createFormlyMcpHandler({ allowedHosts: ['formly.test'], allowedOrigins: ['https://formly.test'] });
  });

  afterEach(async () => {
    await client?.close();
    await handler.close();
    vi.restoreAllMocks();
  });

  async function connect(protocolVersion = '2026-07-28') {
    client = new Client(
      { name: 'formly-test', version: '1' },
      {
        supportedProtocolVersions: [protocolVersion],
        versionNegotiation: { mode: protocolVersion === '2026-07-28' ? { pin: protocolVersion } : 'legacy' },
      },
    );
    await client.connect(
      new StreamableHTTPClientTransport(new URL(endpoint), {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          request.headers.set('host', 'formly.test');
          const response = await handler.fetch(request);
          expect(response.headers.get('mcp-session-id')).toBeNull();
          expect(response.headers.get('cache-control')).toBe('no-store');
          return response;
        },
      }),
    );
    return client;
  }

  async function validate(source: string) {
    return client.callTool({ name: 'formly_validate_fields', arguments: { source } });
  }

  it.each(['2026-07-28', '2025-11-25'])('discovers and calls the public tool using %s', async (protocol) => {
    await connect(protocol);
    const { tools } = await client.listTools();
    expect(tools.map(({ name }) => name)).toEqual([
      'formly_validate_fields',
      'formly_search',
      'formly_lookup',
      'formly_examples',
    ]);
    expect(tools[0]).toMatchObject({
      name: 'formly_validate_fields',
      inputSchema: { required: ['source'], additionalProperties: false },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    });
    const result = await validate('[]');
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toMatchObject({
      status: 'no-structural-errors',
      syntaxValid: true,
      diagnostics: [],
      errorCount: 0,
      warningCount: 0,
      truncated: false,
      version: 'development',
      revision: 'development',
    });
    expect(JSON.parse(result.content.find((content) => content.type === 'text').text)).toEqual(
      result.structuredContent,
    );
    for (const [name, args] of [
      ['formly_search', { query: 'FormlyFieldConfig' }],
      ['formly_lookup', { topic: 'guide/validation' }],
      ['formly_examples', { id: 'examples/advanced/repeating-section' }],
    ] as const) {
      const response = await client.callTool({ name, arguments: args });
      expect(response.isError).not.toBe(true);
      expect(response.structuredContent).toMatchObject({ version: 'development', revision: 'development' });
      expect(JSON.parse(response.content.find((content) => content.type === 'text').text)).toEqual(
        response.structuredContent,
      );
    }
  });

  it('finds API symbols and filters and paginates examples without returning their source', async () => {
    await connect();
    const search = async (args: Record<string, unknown>) =>
      (await client.callTool({ name: 'formly_search', arguments: args })).structuredContent as Record<string, unknown>;
    expect(await search({ query: 'FormlyFieldConfig', kind: 'api', limit: 1 })).toMatchObject({
      results: [{ id: 'api/core#formlyfieldconfig', kind: 'api' }],
    });
    const first = await search({ query: 'validation', kind: 'example', limit: 2 });
    expect(first).toMatchObject({ results: [expect.any(Object), expect.any(Object)], nextOffset: 2 });
    expect(first.results).toEqual([
      expect.objectContaining({ kind: 'example' }),
      expect.objectContaining({ kind: 'example' }),
    ]);
    expect(JSON.stringify(first)).not.toContain('filecontent');
    expect(JSON.stringify(first)).not.toContain('provideFormlyCore');
    const next = await search({ query: 'validation', kind: 'example', offset: 2, limit: 2 });
    expect(next.results).not.toEqual(first.results);
    expect(next.total).toEqual(first.total);
    expect(await search({ query: 'noSuchFormlyTopic958123' })).toMatchObject({
      results: [],
      total: 0,
      nextOffset: null,
    });
  });

  it('looks up guides, package references and symbols and rejects ambiguous titles', async () => {
    await connect();
    const lookup = async (topic: string) => client.callTool({ name: 'formly_lookup', arguments: { topic } });
    expect((await lookup('guide/getting-started')).structuredContent).toMatchObject({
      id: 'guide/getting-started',
      content: expect.stringContaining('provideFormlyCore'),
      url: 'https://formly.dev/guide/getting-started',
      sourceUrl: 'https://github.com/ngx-formly/ngx-formly/blob/main/docs/getting-started.md',
    });
    expect((await lookup('FormlyFieldConfig')).structuredContent).toMatchObject({
      id: 'api/core#formlyfieldconfig',
      content: expect.stringContaining('fieldGroup'),
    });
    expect((await lookup('/api/ui/material/input')).structuredContent).toMatchObject({
      title: '@ngx-formly/material/input',
    });
    const ambiguous = await lookup('FormlyFieldInput');
    expect(ambiguous.isError).toBe(true);
    expect(JSON.stringify(ambiguous.content)).toContain('ambiguous');
  });

  it('lists examples and retrieves complete exported projects with custom types and assets', async () => {
    await connect();
    const examples = async (args: Record<string, unknown> = {}) =>
      (await client.callTool({ name: 'formly_examples', arguments: args })).structuredContent as Record<
        string,
        unknown
      >;
    const page = await examples({ limit: 1 });
    expect(page).toMatchObject({ results: [expect.any(Object)], nextOffset: 1 });
    expect((await examples({ offset: page.total })).results).toEqual([]);
    const repeat = await examples({ id: 'examples/advanced/repeating-section' });
    expect(repeat.files).toMatchObject({
      'src/app/repeat-section.type.ts': expect.stringContaining('FieldArrayType'),
      'src/app/app.config.ts': expect.stringContaining('RepeatTypeComponent'),
      'src/main.ts': expect.stringContaining('bootstrapApplication'),
      'package.json': expect.stringContaining('@ngx-formly/bootstrap'),
    });
    const schema = await examples({ id: 'examples/advanced/json-schema' });
    expect(schema.files).toHaveProperty('src/assets/json-schema/simple.json');
    expect(schema.files).toHaveProperty('src/app/array.type.ts');
    const material = await examples({ id: 'ui/material/datepicker' });
    expect(material.files).toMatchObject({
      'src/app/app.config.ts': expect.stringContaining('withFormlyMaterial'),
      'package.json': expect.stringContaining('@ngx-formly/material'),
    });
    const bootstrap = await examples({ id: 'ui/bootstrap/datepicker' });
    expect(bootstrap.files).toHaveProperty('src/app/additional-types.component.ts');
  });

  it('rejects invalid content arguments and unknown IDs without reading arbitrary files or URLs', async () => {
    await connect();
    for (const [name, args] of [
      ['formly_search', { query: '  ' }],
      ['formly_search', { query: 'x'.repeat(201) }],
      ['formly_search', { query: 'input', limit: 21 }],
      ['formly_search', { query: 'input', offset: -1 }],
      ['formly_search', { query: 'input', kind: 'unknown' }],
      ['formly_lookup', {}],
      ['formly_lookup', { topic: 'https://example.com/private' }],
      ['formly_lookup', { topic: '../../package.json' }],
      ['formly_examples', { id: '' }],
      ['formly_examples', { id: 'unknown' }],
      ['formly_examples', { limit: 1.5 }],
      ['formly_examples', { extra: true }],
    ] as const) {
      expect((await client.callTool({ name, arguments: args })).isError, name).toBe(true);
    }
  });

  it.each([
    '',
    '  ',
    '{}',
    '[{key: 1}]',
    '[{},]',
    '[/* comment */{}]',
    '[\r\n{"fieldGroup":[{"props":{"label":"😀","required":"yes"}}]}\r\n]',
    '[{"templateOptions":{"lable":"Name"},"hideExpression":false}]',
    '[{"key":null,"type":"custom","wrappers":["custom"],"customData":{"lable":1},"props":{"options":[{"arbitrary":true}],"attributes":{"aria-label":null}}}]',
  ])('returns the same diagnostics as the website for %j', async (source) => {
    await connect();
    const result = await validate(source);
    expect(result.isError).not.toBe(true);
    const expected = validation.validateFormlyJson(source);
    expect(result.structuredContent).toMatchObject({
      diagnostics: locateDiagnostics(source, expected.diagnostics),
      status: expected.empty
        ? 'empty'
        : expected.diagnostics.some((d) => d.severity === 'error')
          ? 'invalid'
          : 'no-structural-errors',
    });
  });

  it('keeps warnings visible with a qualified pass', async () => {
    await connect();
    expect((await validate('[{"templateOptions":{}}]')).structuredContent).toMatchObject({
      status: 'no-structural-errors',
      errorCount: 0,
      warningCount: 1,
      scope: expect.stringContaining('Does not verify'),
    });
  });

  it('counts all diagnostics even when the only error is beyond the response limit', async () => {
    await connect();
    const source = JSON.stringify([...Array.from({ length: 101 }, () => ({ templateOptions: {} })), { props: false }]);
    const result = (await validate(source)).structuredContent;
    expect(result).toMatchObject({ status: 'invalid', warningCount: 101, errorCount: 1, truncated: true });
    expect(result).toHaveProperty('diagnostics.length', 100);
  });

  it('never executes expression strings or logs submitted data', async () => {
    await connect();
    const log = vi.spyOn(console, 'log');
    const error = vi.spyOn(console, 'error');
    const warn = vi.spyOn(console, 'warn');
    const expression = 'globalThis.__formlyMcpExecuted = true';
    const result = await validate(
      JSON.stringify([{ expressions: { 'props.disabled': expression }, defaultValue: { lable: 'secret' } }]),
    );
    expect(result.structuredContent).toHaveProperty('status', 'no-structural-errors');
    expect('__formlyMcpExecuted' in globalThis).toBe(false);
    expect(JSON.stringify(result)).not.toContain(expression);
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('enforces decoded UTF-8 byte limits and accepts the exact boundary', async () => {
    await connect();
    expect((await validate(' '.repeat(MAX_SOURCE_BYTES))).structuredContent).toHaveProperty('status', 'empty');
    const result = await validate('😀'.repeat(MAX_SOURCE_BYTES / 4 + 1));
    expect(result.isError).toBe(true);
    expect(result.content).toEqual([{ type: 'text', text: 'Source exceeds the 256 KiB UTF-8 limit.' }]);
  });

  it('handles a large valid configuration and excessive nesting within the source limit', async () => {
    await connect();
    const prefix = '[{"defaultValue":"';
    const suffix = '"}]';
    const large = prefix + 'x'.repeat(MAX_SOURCE_BYTES - prefix.length - suffix.length) + suffix;
    expect((await validate(large)).structuredContent).toHaveProperty('status', 'no-structural-errors');
    const deep = '[' + '{"fieldGroup":['.repeat(5000) + '{}' + ']}'.repeat(5000) + ']';
    const result = await validate(deep);
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toMatchObject({ status: 'invalid', errorCount: 1 });
  });

  it('does not disclose unexpected validator exceptions', async () => {
    await connect();
    vi.spyOn(validation, 'validateFormlyJson').mockImplementation(() => {
      throw new Error('Sensitive configuration');
    });
    const result = await validate('[]');
    expect(result.isError).toBe(true);
    expect(JSON.stringify(result)).not.toContain('Sensitive configuration');
    expect(result.content).toEqual([{ type: 'text', text: 'Configuration validation failed unexpectedly.' }]);
  });

  it('rejects invalid arguments and unknown tools', async () => {
    await connect();
    for (const args of [{}, { source: [] }, { source: '[]', extra: true }]) {
      expect((await client.callTool({ name: 'formly_validate_fields', arguments: args })).isError).toBe(true);
    }
    await expect(client.callTool({ name: 'unknown', arguments: {} })).rejects.toThrow('Tool unknown not found');
  });

  it.each(['GET', 'DELETE', 'PUT'])('does not hold open %s requests', async (method) => {
    const response = await handler.fetch(new Request(endpoint, { method, headers: { host: 'formly.test' } }));
    expect(response.status).toBe(405);
  });

  it.each([
    { host: 'attacker.test' },
    { host: 'formly.test', origin: 'https://attacker.test' },
    { host: 'formly.test', origin: 'https://formly.test:9999' },
    { host: 'formly.test', origin: 'null' },
  ])('rejects untrusted headers %j', async (headers) => {
    const response = await handler.fetch(new Request(endpoint, { method: 'OPTIONS', headers }));
    expect(response.status).toBe(403);
  });

  it('supports browser preflight for an exact allowed origin without credentials', async () => {
    const response = await handler.fetch(
      new Request(endpoint, {
        method: 'OPTIONS',
        headers: { host: 'formly.test', origin: 'https://formly.test' },
      }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('https://formly.test');
    expect(response.headers.get('access-control-allow-headers')).toContain('Mcp-Method');
    expect(response.headers.get('access-control-allow-credentials')).toBeNull();
  });

  it('rejects oversized streamed bodies without a Content-Length header', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(1024 * 1024));
        controller.enqueue(new Uint8Array(1));
        controller.close();
      },
    });
    const response = await handler.fetch(
      new Request(endpoint, {
        method: 'POST',
        headers: { host: 'formly.test', 'content-type': 'application/json' },
        body,
        duplex: 'half',
      } as RequestInit),
    );
    expect(response.status).toBe(413);
  });

  it('rejects unsupported protocol revisions and subscriptions without opening streams', async () => {
    for (const [method, protocolVersion] of [
      ['tools/list', '2099-01-01'],
      ['subscriptions/listen', '2026-07-28'],
    ]) {
      const response = await handler.fetch(
        new Request(endpoint, {
          method: 'POST',
          headers: {
            host: 'formly.test',
            'content-type': 'application/json',
            accept: 'application/json, text/event-stream',
            'mcp-protocol-version': protocolVersion,
            'mcp-method': method,
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method,
            params: {
              _meta: {
                'io.modelcontextprotocol/protocolVersion': protocolVersion,
                'io.modelcontextprotocol/clientCapabilities': {},
              },
            },
          }),
        }),
      );
      expect(response.headers.get('content-type')).toContain('application/json');
      expect(await response.json()).toMatchObject({
        error: {
          code: method === 'tools/list' ? -32022 : -32603,
          message: method === 'tools/list' ? 'Unsupported protocol version: 2099-01-01' : 'Subscription limit reached',
        },
      });
    }
  });

  it('returns protocol errors for malformed requests', async () => {
    const response = await handler.fetch(
      new Request(endpoint, {
        method: 'POST',
        headers: {
          host: 'formly.test',
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
        },
        body: '{broken',
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty('error');
  });
});
