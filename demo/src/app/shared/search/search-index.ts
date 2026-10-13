import menu from '../../app.menu.json';
import { GUIDE_CONTENTS } from '../../guides/guides.content';
import { SearchDocument } from './search';

export const SEARCH_INDEX: SearchDocument[] = menu.flatMap((section) =>
  section.items.flatMap((group) => {
    const pages = group.items || [group];
    return pages.map((page) => ({
      title: page.label,
      path: page.path,
      category: group.items ? `${section.label} / ${group.label}` : section.label,
      content: (section.path === '/guide' ? GUIDE_CONTENTS[page.path.split('/').pop()] || '' : '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#*`|>]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    }));
  }),
);
