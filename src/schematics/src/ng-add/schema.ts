import {Schema as ComponentSchema} from '@schematics/angular/component/schema';

export interface Schema extends ComponentSchema {
  /**
   * Do not add @ngx-formly dependencies to package.json (e.g., --skipPackageJson)
   */
  skipPackageJson?: boolean;
  /**
   * The UI with pre-defined types/templates
   */
  uiTheme?: 'material' | 'bootstrap' | 'ionic' | 'primeng' | 'kendo' | 'ng-zorro-antd';

  /**
   * Name of the module to import to
   */
  module?: string;

  /** Name of the project to target. */
  project?: string;
}
