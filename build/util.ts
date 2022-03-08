import { execSync, ExecSyncOptions } from 'child_process';
import * as fs from 'fs';
import { join } from 'path';

export const PACKAGES = [
  'core',
  'schematics',

  // UI
  'bootstrap',
  'material',
  'ionic',
  'primeng',
  'kendo',
  'nativescript',
  'ng-zorro-antd',
];

export function exec(cmd: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
  return execSync(cmd, options);
}

export function copyDirSync(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = join(src, entry.name);
    let destPath = join(dest, entry.name);

    entry.isDirectory() ? copyDirSync(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
}
