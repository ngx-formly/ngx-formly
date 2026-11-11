import { locateDiagnostics } from './diagnostic-location';
import { validateFormlyJson } from './validate-formly-json';

describe('Diagnostic locations', () => {
  it.each(['\n', '\r\n', '\r'])('locates UTF-16 ranges with %j line endings', (newline) => {
    const source = `[${newline}{"props":{"label":"😀","required":"yes"}}${newline}]`;
    const [diagnostic] = locateDiagnostics(source, validateFormlyJson(source).diagnostics);
    expect(diagnostic).toMatchObject({
      path: [0, 'props', 'required'],
      label: '$[0].props.required',
      line: 2,
      column: 35,
      offset: source.indexOf('"yes"'),
      length: 5,
    });
    expect(source.slice(diagnostic.offset, diagnostic.offset + diagnostic.length)).toBe('"yes"');
  });

  it('quotes property paths that cannot use dot notation', () => {
    const source = '[{"expressions":{"props.disabled":false}}]';
    expect(locateDiagnostics(source, validateFormlyJson(source).diagnostics)[0].label).toBe(
      '$[0].expressions["props.disabled"]',
    );
  });

  it('preserves input order and locations across mixed line endings and UTF-16 offsets', () => {
    const source = 'α\r\n😀\nb\rc\n';
    const locations = [
      [10, 5, 1],
      [4, 2, 2],
      [2, 2, 1],
      [0, 1, 1],
      [8, 4, 1],
      [3, 2, 1],
      [4, 2, 2],
    ];
    const diagnostics = locations.map(([offset]) => ({
      severity: 'error' as const,
      message: 'Test diagnostic',
      path: [],
      offset,
      length: 0,
    }));
    expect(locateDiagnostics(source, diagnostics).map(({ offset, line, column }) => [offset, line, column])).toEqual(
      locations,
    );
  });

  it('handles empty input and an end-of-file diagnostic', () => {
    expect(locateDiagnostics('', [])).toEqual([]);
    expect(
      locateDiagnostics('', [{ severity: 'error', message: 'Missing value', path: [], offset: 0, length: 0 }]),
    ).toEqual([
      { severity: 'error', message: 'Missing value', path: [], offset: 0, length: 0, line: 1, column: 1, label: '$' },
    ]);
  });
});
