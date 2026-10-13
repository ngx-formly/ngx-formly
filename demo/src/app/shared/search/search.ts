export interface SearchDocument {
  title: string;
  path: string;
  category: string;
  content: string;
}

export function searchDocuments(documents: SearchDocument[], query: string) {
  const phrase = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!phrase) {
    return [];
  }

  const terms = phrase.split(' ');
  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const body = document.content.toLowerCase();
      const text = `${title} ${document.category.toLowerCase()} ${body}`;
      const score = terms.every((term) => text.includes(term))
        ? (title === phrase ? 100 : title.includes(phrase) ? 50 : 0) +
          terms.reduce((sum, term) => sum + (title.includes(term) ? 10 : 1), 0)
        : 0;
      const firstMatch = Math.min(...terms.map((term) => body.indexOf(term)).filter((index) => index >= 0));
      const start = Number.isFinite(firstMatch) ? Math.max(0, firstMatch - 45) : 0;
      const excerpt = document.content.slice(start, start + 160);

      return {
        ...document,
        score,
        excerpt: `${start ? '…' : ''}${excerpt}${start + 160 < document.content.length ? '…' : ''}`,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}
