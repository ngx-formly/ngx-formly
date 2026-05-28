import { Routes } from '@angular/router';

export const examplesRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'introduction' },
      // Intro
      {
        path: 'introduction',
        loadChildren: () => import('./introduction/app.routes').then((m) => m.appRoutes),
      },

      // Field Options
      {
        path: 'field-options',
        children: [
          {
            path: 'expression-properties',
            loadChildren: () => import('./field-options/expression-properties/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'default-value',
            loadChildren: () => import('./field-options/default-value/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'hide-fields',
            loadChildren: () => import('./field-options/hide-fields/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'model-options',
            loadChildren: () => import('./field-options/model-options/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // Form Options
      {
        path: 'form-options',
        children: [
          {
            path: 'reset-model',
            loadChildren: () => import('./form-options/reset-model/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'form-state',
            loadChildren: () => import('./form-options/form-state/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // validation
      {
        path: 'validation',
        children: [
          {
            path: 'built-in-validations',
            loadChildren: () => import('./validation/built-in-validations/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'custom-validation',
            loadChildren: () => import('./validation/custom-validation/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'custom-validation-parameters',
            loadChildren: () => import('./validation/custom-validation-parameters/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'validation-message',
            loadChildren: () => import('./validation/validation-message/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'disable-submit-button',
            loadChildren: () => import('./validation/disable-submit-button/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'matching-two-fields',
            loadChildren: () => import('./validation/matching-two-fields/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'force-show-error',
            loadChildren: () => import('./validation/force-show-error/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'toggle-required',
            loadChildren: () => import('./validation/toggle-required/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'unique-value-async-validation',
            loadChildren: () =>
              import('./validation/unique-value-async-validation/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'async-validation-update-on',
            loadChildren: () => import('./validation/async-validation-update-on/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // Bootstrap Formly
      {
        path: 'bootstrap-formly',
        children: [
          {
            path: 'table-rows',
            loadChildren: () => import('./bootstrap-formly/table-rows/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'select',
            loadChildren: () => import('./bootstrap-formly/select/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // Bootstrap Specific
      {
        path: 'bootstrap-specific',
        children: [
          {
            path: 'advanced-layout',
            loadChildren: () => import('./bootstrap-specific/advanced-layout/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'bootstrap-horizontal',
            loadChildren: () => import('./bootstrap-specific/bootstrap-horizontal/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'input-add-ons',
            loadChildren: () => import('./bootstrap-specific/input-add-ons/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // Advanced
      {
        path: 'advanced',
        children: [
          { path: 'i18n', loadChildren: () => import('./advanced/i18n/app.routes').then((m) => m.appRoutes) },
          {
            path: 'i18n-alternative',
            loadChildren: () => import('./advanced/i18n-alternative/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'json-schema',
            loadChildren: () => import('./advanced/json-schema/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'repeating-section',
            loadChildren: () => import('./advanced/repeating-section/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'repeating-section-input',
            loadChildren: () => import('./advanced/repeating-section-input/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'grid-integration',
            loadChildren: () => import('./advanced/grid-integration/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'multi-step-form',
            loadChildren: () => import('./advanced/multi-step-form/app.routes').then((m) => m.appRoutes),
          },
          { path: 'tabs', loadChildren: () => import('./advanced/tabs/app.routes').then((m) => m.appRoutes) },
          {
            path: 'extending-field-types',
            loadChildren: () => import('./advanced/extending-field-types/app.routes').then((m) => m.appRoutes),
          },
        ],
      },

      // Other
      {
        path: 'other',
        children: [
          {
            path: 'cascaded-select',
            loadChildren: () => import('./other/cascaded-select/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'cascaded-select-json',
            loadChildren: () => import('./other/cascaded-select-json/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'observable-select',
            loadChildren: () => import('./other/observable-select/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'advanced-layout-flex',
            loadChildren: () => import('./other/advanced-layout-flex/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'nested-formly-forms',
            loadChildren: () => import('./other/nested-formly-forms/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'material-prefix-suffix',
            loadChildren: () => import('./other/material-prefix-suffix/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'material-formfield-hint-align',
            loadChildren: () => import('./other/material-formfield-hint-align/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'hide-fields-with-animations',
            loadChildren: () => import('./other/hide-fields-with-animations/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'button',
            loadChildren: () => import('./other/button/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'json-powered',
            loadChildren: () => import('./other/json-powered/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'input-file',
            loadChildren: () => import('./other/input-file/app.routes').then((m) => m.appRoutes),
          },
          {
            path: 'presets',
            loadChildren: () => import('./other/presets/app.routes').then((m) => m.appRoutes),
          },
        ],
      },
    ],
  },
];
