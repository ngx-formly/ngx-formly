import menu from './app.menu.json';
import apiMenu from './api/api-menu.generated.json';

export interface MenuItem {
  path?: string;
  href?: string;
  label: string;
  items?: MenuItem[];
}

export const APP_MENU: MenuItem[] = [
  ...menu,
  { path: '/api', label: 'API', items: apiMenu },
  {
    path: '/tools',
    label: 'Tools',
    items: [
      { href: 'https://builder.formly.dev/', label: 'Form builder' },
      { path: '/tools/validator', label: 'JSON validator' },
    ],
  },
];

export function menuPages(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => (item.items ? menuPages(item.items) : [item]));
}

export function menuAncestors(items: MenuItem[], path: string): MenuItem[] | undefined {
  for (const item of items) {
    const ancestors = item.items && menuAncestors(item.items, path);
    if (ancestors) {
      return [item, ...ancestors];
    }
    if (item.path === path) {
      return item.items ? [item] : [];
    }
  }

  return undefined;
}
