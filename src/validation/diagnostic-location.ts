import { ConfigurationDiagnostic } from './validate-formly-json';

/** Locations refer to the original source, with UTF-16 offsets and one-based lines and columns. */
export function locateDiagnostics(source: string, diagnostics: ConfigurationDiagnostic[]) {
  if (!diagnostics.length) return [];

  const breaks: { start: number; end: number }[] = [];
  for (const match of source.matchAll(/\r\n|\r|\n/g)) {
    breaks.push({ start: match.index, end: match.index + match[0].length });
  }

  return diagnostics.map((diagnostic) => {
    let low = 0;
    let high = breaks.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (breaks[middle].start < diagnostic.offset) low = middle + 1;
      else high = middle;
    }

    return {
      ...diagnostic,
      line: low + 1,
      column: Math.max(1, diagnostic.offset - (low ? breaks[low - 1].end : 0) + 1),
      label:
        '$' +
        diagnostic.path
          .map((part) =>
            typeof part === 'number'
              ? `[${part}]`
              : /^[a-zA-Z_$][\w$]*$/.test(part)
                ? `.${part}`
                : `[${JSON.stringify(part)}]`,
          )
          .join(''),
    };
  });
}
