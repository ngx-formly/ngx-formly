import { SEARCH_INDEX } from './search-index';
import { searchDocuments } from './search';

vi.mock('../../guides/guides.content', () => ({
  GUIDE_CONTENTS: {
    validation: '# Validation\nUse **validators** and [validationMessages](https://formly.dev).',
    'properties-options': 'Configure validation messages for a field.',
    v11: 'Angular 22 and zoneless applications. Signal Forms is planned for v12.',
    v10: 'Replace provideFormly with provideFormlyCore.',
  },
}));

describe('Documentation search', () => {
  it('ranks a page title above content matches, ignoring case and whitespace', () => {
    const results = searchDocuments(SEARCH_INDEX, '  VALIDATION  ');
    expect(results[0].path).toBe('/guide/validation');
    expect(results.map((result) => result.path)).toContain('/guide/properties-options');
  });

  it('finds content that is not in a page title and removes Markdown from excerpts', () => {
    const result = searchDocuments(SEARCH_INDEX, 'validationMessages').find(
      (result) => result.path === '/guide/validation',
    );
    expect(result.path).toBe('/guide/validation');
    expect(result.excerpt).toBe('Validation Use validators and validationMessages.');
  });

  it('requires every query term and searches categories as well as titles', () => {
    expect(searchDocuments(SEARCH_INDEX, 'examples reset model').map((result) => result.path)).toEqual([
      '/examples/form-options/reset-model',
    ]);
    expect(searchDocuments(SEARCH_INDEX, 'ui bootstrap')[0].path).toBe('/ui/bootstrap');
    expect(searchDocuments(SEARCH_INDEX, 'validation nonexistent')).toEqual([]);
  });

  it('includes every migration page and searches its content', () => {
    expect(searchDocuments(SEARCH_INDEX, 'migration guides')).toHaveLength(8);
    expect(
      searchDocuments(SEARCH_INDEX, 'provideFormlyCore').some((result) => result.path === '/guide/migration/v10'),
    ).toBe(true);
    expect(searchDocuments(SEARCH_INDEX, 'zoneless')[0].path).toBe('/guide/migration/v11');
    expect(new Set(SEARCH_INDEX.map((entry) => entry.path)).size).toBe(SEARCH_INDEX.length);
  });

  it('returns no results for empty or unmatched queries', () => {
    expect(searchDocuments(SEARCH_INDEX, ' \n ')).toEqual([]);
    expect(searchDocuments(SEARCH_INDEX, '<script>alert(1)</script>')).toEqual([]);
  });

  it('finds API symbols and member names with links to their reference headings', () => {
    expect(searchDocuments(SEARCH_INDEX, 'FormlyFormBuilder')[0].path).toBe('/api/core#formlyformbuilder');
    expect(searchDocuments(SEARCH_INDEX, 'provideFormlyCore')[0].path).toBe('/api/core#provideformlycore');
    expect(
      searchDocuments(SEARCH_INDEX, 'buildForm').some((result) => result.path === '/api/core#formlyformbuilder'),
    ).toBe(true);
    expect(searchDocuments(SEARCH_INDEX, 'FormlyJsonschema')[0].path).toBe('/api/core/json-schema#formlyjsonschema');
    expect(
      searchDocuments(SEARCH_INDEX, 'FormlyFieldSelect').some(
        (result) => result.path === '/api/ui/material/select#formlyfieldselect',
      ),
    ).toBe(true);
  });
});
