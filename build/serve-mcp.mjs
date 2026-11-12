import { createServer } from 'node:http';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { createFormlyMcpHandler } from '../dist/@ngx-formly/mcp/index.js';

const handler = createFormlyMcpHandler({
  allowedHosts: ['localhost', '127.0.0.1'],
  allowedOrigins: ['http://localhost:4101', 'http://127.0.0.1:4101', 'http://localhost:4100', 'http://127.0.0.1:4100'],
});
const handle = toNodeHandler(handler);
const server = createServer((request, response) => {
  if (request.url?.split('?')[0] !== '/mcp') {
    response.writeHead(404).end();
    return;
  }
  void handle(request, response);
});
server.listen(4101, '127.0.0.1', () => {
  console.log('Formly MCP: http://127.0.0.1:4101/mcp (Netlify rate limiting is not active locally).');
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await handler.close();
    server.close();
  });
}
