import { register } from 'ts-node';

// Schematic factories are loaded with require() by the Angular DevKit.
register({ project: 'src/schematics/tsconfig.lib.json', transpileOnly: true });
