import type { Context } from '@netlify/functions';
import mcp, { config } from '../../../demo/functions/mcp';

describe('Netlify MCP adapter', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('configures the public route with distributed IP and domain limits', () => {
    expect(config).toEqual({
      path: '/mcp',
      rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'], action: 'rate_limit' },
    });
  });

  it('accepts trusted deployment hosts and rejects arbitrary request hosts', async () => {
    vi.stubGlobal('__FORMLY_DEPLOY_URLS__', [
      'https://unique--formly.netlify.app',
      'https://deploy-preview-1--formly.netlify.app',
    ]);
    const context = { site: { url: 'https://formly.dev' } } as Context;
    for (const host of [
      'formly.dev',
      'unique--formly.netlify.app',
      'deploy-preview-1--formly.netlify.app',
      'other.netlify.app',
    ]) {
      const response = await mcp(
        new Request(`https://${host}/mcp`, {
          method: 'OPTIONS',
          headers: { host, origin: `https://${host}` },
        }),
        context,
      );
      expect(response.status).toBe(host === 'other.netlify.app' ? 403 : 204);
    }
  });

  it('uses the platform site URL when no build URLs are present', async () => {
    const response = await mcp(
      new Request('https://formly.dev/mcp', { method: 'OPTIONS', headers: { host: 'formly.dev' } }),
      { site: { url: 'https://formly.dev' } } as Context,
    );
    expect(response.status).toBe(204);
  });
});
