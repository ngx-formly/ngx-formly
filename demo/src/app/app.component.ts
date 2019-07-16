import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formly-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSmallDevice$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
    map(result => result.matches),
  );

  menu = [
    {
      path: 'guide',
      title: 'Guides',
      links: [
        { path: '/guide/getting-started', title: 'Getting started' },
        { path: '/guide/properties-options', title: 'Properties and Options' },
        { path: '/guide/validation', title: 'Validation' },
        { path: '/guide/expression-properties', title: 'Formly Expressions' },
        { path: '/guide/custom-formly-field', title: 'Custom Templates' },
        { path: '/guide/custom-formly-wrapper', title: 'Custom Wrapper' },
      ],
    },
    {
      path: 'ui',
      title: 'UI',
      links: [
        { path: '/ui/bootstrap', title: 'Bootstrap' },
        { path: '/ui/material', title: 'Material' },
        { path: '/ui/ionic', title: 'Ionic' },
        { path: '/ui/primeng', title: 'PrimeNG' },
        { path: '/ui/kendo', title: 'Kendo' },
      ],
    },
    {
      path: 'examples',
      title: 'Examples',
      links: [
        { title: 'Intro' },
        { path: '/examples/introduction', title: 'Introduction Example' },

        { title: 'Field Options' },
        { path: '/examples/field-options/expression-properties', title: 'Expression Properties' },
        { path: '/examples/field-options/default-value', title: 'Default Value' },
        { path: '/examples/field-options/hide-fields', title: 'Hide Fields' },
        { path: '/examples/field-options/model-options', title: 'modelOptions' },

        { title: 'Form Options' },
        { path: '/examples/form-options/reset-model', title: 'Reset Model' },
        { path: '/examples/form-options/form-state', title: 'Form State' },

        { title: 'Validation Options' },
        { path: '/examples/validation/built-in-validations', title: 'Built-in validations' },
        { path: '/examples/validation/custom-validation', title: 'Custom validation' },
        { path: '/examples/validation/validation-message', title: 'Validation message' },
        { path: '/examples/validation/unique-value-async-validation', title: 'Async validation of unique value' },
        { path: '/examples/validation/async-validation-update-on', title: 'Async validation and `updateOn`' },
        { path: '/examples/validation/matching-two-fields', title: 'Matching Two Fields' },
        { path: '/examples/validation/force-show-error', title: 'Force showing error state' },
        { path: '/examples/validation/toggle-required', title: 'Toggle required field' },
        { path: '/examples/validation/disable-submit-button', title: 'Disable submit button' },

        { title: 'Bootstrap Formly' },
        { path: '/examples/bootstrap-formly/table-rows', title: 'Table Rows' },
        { path: '/examples/bootstrap-formly/select', title: 'Select' },

        { title: 'Bootstrap Specific' },
        { path: '/examples/bootstrap-specific/advanced-layout', title: 'Advanced Layout' },
        { path: '/examples/bootstrap-specific/bootstrap-horizontal', title: 'Bootstrap Horizontal' },
        { path: '/examples/bootstrap-specific/input-add-ons', title: 'Input add-ons' },

        { title: 'Advanced' },
        { path: '/examples/advanced/i18n', title: 'i18n ngx-translate' },
        { path: '/examples/advanced/i18n-alternative', title: 'i18n ngx-translate (alternative approach)' },
        { path: '/examples/advanced/json-schema', title: 'Json schema' },
        { path: '/examples/advanced/repeating-section', title: 'Repeating Section' },
        { path: '/examples/advanced/repeating-section-input', title: 'Repeating Section With Length Input' },
        { path: '/examples/advanced/multi-step-form', title: 'Multi-Step Form' },
        { path: '/examples/advanced/tabs', title: 'Tabs Form' },
        { path: '/examples/advanced/grid-integration', title: 'ag-grid Integration' },
        { path: '/examples/advanced/datatable-integration', title: 'ngx-datatable Integration' },

        { title: 'Other' },
        { path: '/examples/other/cascaded-select', title: 'Cascaded Select (using observable)' },
        { path: '/examples/other/cascaded-select-json', title: 'Cascaded Select JSON powered' },
        { path: '/examples/other/observable-select', title: 'Bind Observable to Select' },
        { path: '/examples/other/advanced-layout-flex', title: 'Advanced Layout (Flex)' },
        { path: '/examples/other/nested-formly-forms', title: 'Nested Forms (fieldGroup wrapper)' },
        { path: '/examples/other/material-prefix-suffix', title: 'Material Field Prefix/Suffix' },
        { path: '/examples/other/hide-fields-with-animations', title: 'Hide Fields with `@angular/animations`' },
        { path: '/examples/other/button', title: 'Button Type' },
        { path: '/examples/other/json-powered', title: 'JSON powered' },
        { path: '/examples/other/input-file', title: 'File input' },
      ],
    },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}
}


