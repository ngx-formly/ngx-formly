import { exec } from './util';

// build
exec('cd src/schematics && npm run build');
// copy to dist
exec('cp -r src/schematics dist/@ngx-formly/schematics');
