export interface Schema {
  /**
   * Do not add @ngx-formly dependencies to package.json (e.g., --skipPackageJson)
   */
  skipPackageJson?: boolean;
  /**
   * The UI with pre-defined types/templates
   */
  uiTheme?: 'material' | 'bootstrap' | 'ionic' | 'primeng' | 'kendo';

  /**
   * Name of the module to import to
   */
  module?: string;

  /** Name of the project to target. */
  project?: string;
}
