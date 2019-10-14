import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', children: [
        { path: '', pathMatch: 'full', redirectTo: 'introduction' },
        // Intro
        { path: 'introduction', loadChildren: () => import('./introduction/config.module').then(m => m.ConfigModule) },

        // Field Options
        { path: 'field-options', children: [
          { path: 'expression-properties', loadChildren: () => import('./field-options/expression-properties/config.module').then(m => m.ConfigModule) },
          { path: 'default-value', loadChildren: () => import('./field-options/default-value/config.module').then(m => m.ConfigModule) },
          { path: 'hide-fields', loadChildren: () => import('./field-options/hide-fields/config.module').then(m => m.ConfigModule) },
          { path: 'model-options', loadChildren: () => import('./field-options/model-options/config.module').then(m => m.ConfigModule) },
        ]},

        // Form Options
        { path: 'form-options', children: [
          { path: 'reset-model', loadChildren: () => import('./form-options/reset-model/config.module').then(m => m.ConfigModule) },
          { path: 'form-state', loadChildren: () => import('./form-options/form-state/config.module').then(m => m.ConfigModule) },
        ]},

        // validation
        { path: 'validation', children: [
          { path: 'built-in-validations', loadChildren: () => import('./validation/built-in-validations/config.module').then(m => m.ConfigModule) },
          { path: 'custom-validation', loadChildren: () => import('./validation/custom-validation/config.module').then(m => m.ConfigModule) },
          { path: 'custom-validation-parameters', loadChildren: () => import('./validation/custom-validation-parameters/config.module').then(m => m.ConfigModule) },
          { path: 'validation-message', loadChildren: () => import('./validation/validation-message/config.module').then(m => m.ConfigModule) },
          { path: 'disable-submit-button', loadChildren: () => import('./validation/disable-submit-button/config.module').then(m => m.ConfigModule) },
          { path: 'matching-two-fields', loadChildren: () => import('./validation/matching-two-fields/config.module').then(m => m.ConfigModule) },
          { path: 'force-show-error', loadChildren: () => import('./validation/force-show-error/config.module').then(m => m.ConfigModule) },
          { path: 'toggle-required', loadChildren: () => import('./validation/toggle-required/config.module').then(m => m.ConfigModule) },
          { path: 'unique-value-async-validation', loadChildren: () => import('./validation/unique-value-async-validation/config.module').then(m => m.ConfigModule) },
          { path: 'async-validation-update-on', loadChildren: () => import('./validation/async-validation-update-on/config.module').then(m => m.ConfigModule) },
        ]},

        // Bootstrap Formly
        { path: 'bootstrap-formly', children: [
          { path: 'table-rows', loadChildren: () => import('./bootstrap-formly/table-rows/config.module').then(m => m.ConfigModule) },
          { path: 'select', loadChildren: () => import('./bootstrap-formly/select/config.module').then(m => m.ConfigModule) },
        ]},

        // Bootstrap Specific
        { path: 'bootstrap-specific', children: [
          { path: 'advanced-layout', loadChildren: () => import('./bootstrap-specific/advanced-layout/config.module').then(m => m.ConfigModule) },
          { path: 'bootstrap-horizontal', loadChildren: () => import('./bootstrap-specific/bootstrap-horizontal/config.module').then(m => m.ConfigModule) },
          { path: 'input-add-ons', loadChildren: () => import('./bootstrap-specific/input-add-ons/config.module').then(m => m.ConfigModule) },
        ]},

        // Advanced
        { path: 'advanced', children: [
          { path: 'i18n', loadChildren: () => import('./advanced/i18n/config.module').then(m => m.ConfigModule) },
          { path: 'i18n-alternative', loadChildren: () => import('./advanced/i18n-alternative/config.module').then(m => m.ConfigModule) },
          { path: 'json-schema', loadChildren: () => import('./advanced/json-schema/config.module').then(m => m.ConfigModule) },
          { path: 'repeating-section', loadChildren: () => import('./advanced/repeating-section/config.module').then(m => m.ConfigModule) },
          { path: 'repeating-section-input', loadChildren: () => import('./advanced/repeating-section-input/config.module').then(m => m.ConfigModule) },
          { path: 'datatable-integration', loadChildren: () => import('./advanced/datatable-integration/config.module').then(m => m.ConfigModule) },
          { path: 'grid-integration', loadChildren: () => import('./advanced/grid-integration/config.module').then(m => m.ConfigModule) },
          { path: 'multi-step-form', loadChildren: () => import('./advanced/multi-step-form/config.module').then(m => m.ConfigModule) },
          { path: 'tabs', loadChildren: () => import('./advanced/tabs/config.module').then(m => m.ConfigModule) },
        ]},

        // Other
        { path: 'other', children: [
          { path: 'cascaded-select', loadChildren: () => import('./other/cascaded-select/config.module').then(m => m.ConfigModule) },
          { path: 'cascaded-select-json', loadChildren: () => import('./other/cascaded-select-json/config.module').then(m => m.ConfigModule) },
          { path: 'observable-select', loadChildren: () => import('./other/observable-select/config.module').then(m => m.ConfigModule) },
          { path: 'advanced-layout-flex', loadChildren: () => import('./other/advanced-layout-flex/config.module').then(m => m.ConfigModule) },
          { path: 'nested-formly-forms', loadChildren: () => import('./other/nested-formly-forms/config.module').then(m => m.ConfigModule) },
          { path: 'material-prefix-suffix', loadChildren: () => import('./other/material-prefix-suffix/config.module').then(m => m.ConfigModule) },
          { path: 'hide-fields-with-animations', loadChildren: () => import('./other/hide-fields-with-animations/config.module').then(m => m.ConfigModule) },
          { path: 'button', loadChildren: () => import('./other/button/config.module').then(m => m.ConfigModule) },
          { path: 'json-powered', loadChildren: () => import('./other/json-powered/config.module').then(m => m.ConfigModule) },
          { path: 'input-file', loadChildren: () => import('./other/input-file/config.module').then(m => m.ConfigModule) },
        ]},
      ] },
    ]),
  ],
})
export class ExamplesModule { }
