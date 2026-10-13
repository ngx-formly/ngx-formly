import { highlight, renderMarkdown } from './highlight';

describe('demo source rendering', () => {
  it('highlights TypeScript while escaping HTML in source strings', () => {
    const html = highlight('const template = "<script>alert(1)</script>";', 'typescript');

    expect(html).toContain('hljs-keyword');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('renders Markdown with heading anchors, links, and highlighted code blocks', () => {
    const html = renderMarkdown('# Getting started\n\n[Guide](#getting-started)\n\n```ts\nconst value = 1;\n```');

    expect(html).toContain('<h1 id="getting-started">Getting started</h1>');
    expect(html).toContain('href="#getting-started"');
    expect(html).toContain('<pre class="hljs">');
    expect(html).toContain('hljs-keyword');
  });

  it('renders code blocks with missing or unknown languages', () => {
    for (const language of ['', 'unknown-language']) {
      const html = renderMarkdown(`\`\`\`${language}\n<example>\n\`\`\``);

      expect(html).toContain('&lt;');
      expect(html).not.toContain('<example>');
    }
  });
});
