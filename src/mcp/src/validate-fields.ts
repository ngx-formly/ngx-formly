import { Buffer } from 'node:buffer';
import { fromJsonSchema, McpServer } from '@modelcontextprotocol/server';
import { validateFormlyJson } from '../../validation/validate-formly-json';
import { locateDiagnostics } from '../../validation/diagnostic-location';

export const MAX_SOURCE_BYTES = 256 * 1024;
export const MAX_DIAGNOSTICS = 100;
export const SCOPE =
  'Checks strict JSON and shared Formly configuration structure. Does not verify custom component registration, expressions, runtime behavior, or model values. Never executes application code.';

const inputSchema = fromJsonSchema<{ source: string }>({
  type: 'object',
  properties: { source: { type: 'string', description: 'The original strict JSON fields array, as text.' } },
  required: ['source'],
  additionalProperties: false,
});

const outputSchema = fromJsonSchema({
  type: 'object',
  properties: {
    status: { enum: ['empty', 'invalid', 'no-structural-errors'] },
    syntaxValid: { type: 'boolean' },
    errorCount: { type: 'integer', minimum: 0 },
    warningCount: { type: 'integer', minimum: 0 },
    truncated: { type: 'boolean' },
    scope: { type: 'string' },
    version: { type: 'string' },
    revision: { type: 'string' },
    diagnostics: {
      type: 'array',
      maxItems: MAX_DIAGNOSTICS,
      items: {
        type: 'object',
        properties: {
          severity: { enum: ['error', 'warning'] },
          message: { type: 'string' },
          path: { type: 'array', items: { type: ['string', 'integer'] } },
          offset: { type: 'integer', minimum: 0 },
          length: { type: 'integer', minimum: 0 },
          line: { type: 'integer', minimum: 1 },
          column: { type: 'integer', minimum: 1 },
          label: { type: 'string' },
        },
        required: ['severity', 'message', 'path', 'offset', 'length', 'line', 'column', 'label'],
        additionalProperties: false,
      },
    },
  },
  required: [
    'status',
    'syntaxValid',
    'errorCount',
    'warningCount',
    'truncated',
    'scope',
    'version',
    'revision',
    'diagnostics',
  ],
  additionalProperties: false,
});

export function registerValidator(server: McpServer, version: string, revision: string) {
  server.registerTool(
    'formly_validate_fields',
    {
      title: 'Validate Formly fields JSON',
      description: `${SCOPE} Accepts at most 256 KiB of UTF-8 source; returns the first 100 diagnostics with total counts. Locations use UTF-16 offsets and one-based lines and columns. A structural pass can still contain warnings.`,
      inputSchema,
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    ({ source }) => {
      if (Buffer.byteLength(source, 'utf8') > MAX_SOURCE_BYTES) {
        return { isError: true, content: [{ type: 'text', text: 'Source exceeds the 256 KiB UTF-8 limit.' }] };
      }

      try {
        const result = validateFormlyJson(source);
        const errorCount = result.diagnostics.filter(({ severity }) => severity === 'error').length;
        const warningCount = result.diagnostics.length - errorCount;
        const output = {
          status: result.empty ? 'empty' : errorCount ? 'invalid' : 'no-structural-errors',
          syntaxValid: result.syntaxValid,
          errorCount,
          warningCount,
          truncated: result.diagnostics.length > MAX_DIAGNOSTICS,
          scope: SCOPE,
          version,
          revision,
          diagnostics: locateDiagnostics(source, result.diagnostics.slice(0, MAX_DIAGNOSTICS)),
        };
        return { structuredContent: output, content: [{ type: 'text', text: JSON.stringify(output) }] };
      } catch {
        // Do not disclose submitted configuration through unexpected exception messages.
        return { isError: true, content: [{ type: 'text', text: 'Configuration validation failed unexpectedly.' }] };
      }
    },
  );
}
