import { execSync, ExecSyncOptions } from 'child_process';

export const PACKAGES = ['core', 'bootstrap', 'material', 'ionic', 'primeng', 'kendo', 'schematics', 'nativescript'];

export function exec(cmd: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
  return execSync(cmd, options);
}
