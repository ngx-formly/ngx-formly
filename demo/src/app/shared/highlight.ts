import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';

Object.entries({ bash, css, diff, javascript, json, plaintext, scss, typescript, xml }).forEach(([name, language]) =>
  hljs.registerLanguage(name, language),
);

export function highlight(code: string, language: string): string {
  return hljs.getLanguage(language) ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
}

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { highlight }).replace(/<pre>/g, '<pre class="hljs">');
}
