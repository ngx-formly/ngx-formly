import { Component } from '@angular/core';

@Component({
  selector: 'formly-demo-examples',
  template: `
  <mat-sidenav-container style="min-height: 90% !important;">
    <mat-sidenav mode="side" opened="true" [style.width.px]="250">
      <mat-nav-list *ngFor="let nav of navs">
        <h3 mat-subheader>{{ nav.title }}</h3>
        <a *ngFor="let link of nav.links" mat-list-item [routerLink]="link.href">
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
    ]},
    { title: 'Other', links: [
      { href: './other/cascaded-select', text: 'Cascaded Select' },
      { href: './other/disable-submit-button', text: 'Disable submit button' },
      { href: './other/advanced-layout-flex', text: 'Advanced Layout (Flex)' },
    ]},
  ];
}
