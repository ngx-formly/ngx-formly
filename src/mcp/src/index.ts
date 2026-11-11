import { createMcpHandler, hostHeaderValidationResponse, McpServer } from '@modelcontextprotocol/server';
import { registerValidator, SCOPE } from './validate-fields';
import { registerContentTools } from './content';

declare const __FORMLY_VERSION__: string;
declare const __FORMLY_REVISION__: string;

const version = typeof __FORMLY_VERSION__ === 'undefined' ? 'development' : __FORMLY_VERSION__;
const revision = typeof __FORMLY_REVISION__ === 'undefined' ? 'development' : __FORMLY_REVISION__;

export interface FormlyMcpOptions {
  /** Trusted hostnames, without ports. Do not derive these from the incoming request. */
  allowedHosts: string[];
  /** Exact browser origins. Requests without an Origin header are accepted. */
  allowedOrigins: string[];
}

/** Public, stateless Streamable HTTP handler. Apply rate limiting at the hosting layer. */
export function createFormlyMcpHandler(options: FormlyMcpOptions): {
  fetch(request: Request): Promise<Response>;
  close(): Promise<void>;
} {
  const handler = createMcpHandler(
    () => {
      const server = new McpServer(
        { name: '@ngx-formly/mcp', version },
        {
          instructions: `Search Formly guides, API references and examples with formly_search, then read them with formly_lookup or formly_examples. Content is bundled at the server build version. ${SCOPE}`,
          capabilities: { tools: { listChanged: false } },
        },
      );
      registerValidator(server, version, revision);
      registerContentTools(server, version, revision);
      return server;
    },
    { legacy: 'stateless', maxRequestBodySize: 1024 * 1024, maxSubscriptions: 0 },
  );

  return {
    close: handler.close,
    async fetch(request) {
      const origin = request.headers.get('origin');
      const allowedOrigin = origin !== null && options.allowedOrigins.includes(origin);
      let response = hostHeaderValidationResponse(request, options.allowedHosts);
      if (!response && origin !== null && !allowedOrigin) {
        response = new Response('Origin not allowed.', { status: 403 });
      }
      if (!response) {
        try {
          response = request.method === 'OPTIONS' ? new Response(null, { status: 204 }) : await handler.fetch(request);
        } catch {
          response = new Response('MCP request failed.', { status: 500 });
        }
      }

      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store');
      headers.set('Vary', 'Origin');
      if (allowedOrigin) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Method, Mcp-Name');
      }
      return new Response(response.body, { status: response.status, headers });
    },
  };
}
