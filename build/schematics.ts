import { copyDirSync, exec } from './util';

// build
exec('cd src/schematics && npm run build');
// copy to dist
copyDirSync('src/schematics', 'dist/@ngx-formly/schematics');
