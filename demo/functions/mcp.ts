import type { Config, Context } from '@netlify/functions';
import { createFormlyMcpHandler } from '@ngx-formly/mcp';

declare const __FORMLY_DEPLOY_URLS__: string[];

export default async function mcp(request: Request, context: Context) {
  // Netlify's preview URL environment variables are available only during the build.
  const deployUrls = typeof __FORMLY_DEPLOY_URLS__ === 'undefined' ? [] : __FORMLY_DEPLOY_URLS__;
  const urls = [context.site.url, ...deployUrls].map((url) => new URL(url));
  const handler = createFormlyMcpHandler({
    allowedHosts: urls.map((url) => url.hostname),
    allowedOrigins: urls.map((url) => url.origin),
  });
  return handler.fetch(request);
}

export const config: Config = {
  path: '/mcp',
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ['ip', 'domain'], action: 'rate_limit' },
};
