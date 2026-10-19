import menu from '../app.menu.json';
import { menuPages } from '../app.menu';
import { DocumentationPage } from '../shared/documentation/documentation';
import { GUIDE_CONTENTS } from './guides.content';

export const GUIDE_PAGES: DocumentationPage[] = menuPages(menu.find((section) => section.path === '/guide').items).map(
  ({ path, label }) => {
    const id = path.split('/').pop();
    return {
      path,
      title: label,
      source: path.includes('/migration/') ? `UPGRADE-${id.slice(1)}.0.md` : `docs/${id}.md`,
      content: GUIDE_CONTENTS[id],
    };
  },
);
