import menu from '../../app.menu.json';
import { GUIDE_CONTENTS } from '../../guides/guides.content';
import { SearchDocument } from './search';
import apiPages from '../../api/api.generated.json';
import { Slugger } from 'marked';

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

for (const page of apiPages) {
  const slugger = new Slugger();
  const sections = page.content.split(/\n(?=#{2,3} )/);
  for (const section of sections.slice(1)) {
    const title = /^#{2,3} ([^\n]+)/.exec(section)?.[1];
    if (!title) continue;
    SEARCH_INDEX.push({
      title,
      path: `${page.path}#${slugger.slug(title)}`,
      category: `API / ${page.title}`,
      content: section
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#*`|>]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    });
  }
}
