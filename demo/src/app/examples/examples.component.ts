import { Component } from '@angular/core';

@Component({
  selector: 'formly-demo-examples',
  template: `
  <mat-sidenav-container style="min-height: 90% !important;" class="mat-typography">
    <mat-sidenav mode="side" opened="true" [style.width.px]="250" [fixedTopGap]="59" [fixedInViewport]="true">
      <mat-nav-list *ngFor="let nav of navs" dense>
        <h3 mat-subheader>{{ nav.title }}</h3>
        <mat-divider></mat-divider>

        <a *ngFor="let link of nav.links" mat-list-item [routerLink]="link.href" routerLinkActive="active-link">
          {{ link.text }}
        </a>
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
      <router-outlet></router-outlet>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
})
export class ExamplesComponent {
  navs = [
    { title: 'Intro', links: [
      { href: './introduction', text: 'Introduction Example' },
    ]},
    { title: 'Field Options', links: [
      { href: './field-options/expression-properties', text: 'Expression Properties' },
      { href: './field-options/default-value', text: 'Default Value' },
      { href: './field-options/hide-fields', text: 'Hide Fields' },
      { href: './field-options/model-options', text: 'modelOptions' },
    ]},
    { title: 'Form Options', links: [
      { href: './form-options/reset-model', text: 'Reset Model' },
      { href: './form-options/form-state', text: 'Form State' },
    ]},
    { title: 'Validation', links: [
      { href: './validation/built-in-validations', text: 'Built-in validations' },
      { href: './validation/custom-validation', text: 'Custom validation' },
      { href: './validation/validation-message', text: 'Validation message' },
      { href: './validation/unique-value-async-validation', text: 'Async validation of unique value' },
      { href: './validation/matching-two-fields', text: 'Matching Two Fields' },
      { href: './validation/force-show-error', text: 'Force showing error state' },
      { href: './validation/toggle-required', text: 'Toggle required field' },
      { href: './validation/disable-submit-button', text: 'Disable submit button' },
    ]},
    { title: 'Bootstrap Formly', links: [
      { href: './bootstrap-formly/table-rows', text: 'Table Rows' },
      { href: './bootstrap-formly/select', text: 'Select' },
    ]},
    // { title: 'Custom Types (TODO)', links: []},
    { title: 'Bootstrap Specific', links: [
      { href: './bootstrap-specific/advanced-layout', text: 'Advanced Layout' },
      { href: './bootstrap-specific/bootstrap-horizontal', text: 'Bootstrap Horizontal' },
      { href: './bootstrap-specific/input-add-ons', text: 'Input add-ons' },
    ]},
    { title: 'Advanced', links: [
      { href: './advanced/repeating-section', text: 'Repeating Section' },
      { href: './advanced/multi-step-form', text: 'Multi-Step Form' },
      { href: './advanced/tabs', text: 'Tabs Form' },
    ]},
    { title: 'Other', links: [
      { href: './other/cascaded-select', text: 'Cascaded Select' },
      { href: './other/observable-select', text: 'Bind Observable to Select' },
      { href: './other/advanced-layout-flex', text: 'Advanced Layout (Flex)' },
      { href: './other/nested-formly-forms', text: 'Nested Forms (fieldGroup wrapper)' },
      { href: './other/hide-fields-with-animations', text: 'Hide Fields with `@angular/animations`' },
      { href: './other/button', text: 'Button Type' },
      { href: './other/json-powered', text: 'JSON powered' },
      { href: './other/input-file', text: 'File input' },
    ]},
  ];
}
