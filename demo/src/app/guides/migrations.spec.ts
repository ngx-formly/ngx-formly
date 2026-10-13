import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import menu from '../app.menu.json';

describe('Migration navigation', () => {
  it('links to every available upgrade guide, newest first', () => {
    const versions = readdirSync(resolve(__dirname, '../../../..'))
      .map((file) => /^UPGRADE-(\d+)\.0\.md$/.exec(file)?.[1])
      .filter(Boolean)
      .map(Number)
      .sort((a, b) => b - a);
    const migrations = menu
      .find((section) => section.path === '/guide')
      .items.find((item) => item.path === '/guide/migration');

    expect(migrations.items).toEqual(
      versions.map((version) => ({ path: `/guide/migration/v${version}`, label: `Upgrade to v${version}` })),
    );
  });
});
