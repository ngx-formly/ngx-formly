import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

import { ExamplesComponent } from './examples.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ExamplesComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'introduction' },
        // Intro
        { path: 'introduction', loadChildren: './introduction/config.module#ConfigModule' },

        // Field Options
        { path: 'field-options', children: [
          { path: 'expression-properties', loadChildren: './field-options/expression-properties/config.module#ConfigModule' },
          { path: 'default-value', loadChildren: './field-options/default-value/config.module#ConfigModule' },
          { path: 'hide-fields', loadChildren: './field-options/hide-fields/config.module#ConfigModule' },
          { path: 'model-options', loadChildren: './field-options/model-options/config.module#ConfigModule' },
        ]},

        // Form Options
        { path: 'form-options', children: [
          { path: 'reset-model', loadChildren: './form-options/reset-model/config.module#ConfigModule' },
          { path: 'form-state', loadChildren: './form-options/form-state/config.module#ConfigModule' },
        ]},

        // Bootstrap Formly
        { path: 'bootstrap-formly', children: [
          { path: 'table-rows', loadChildren: './bootstrap-formly/table-rows/config.module#ConfigModule' },
          { path: 'select', loadChildren: './bootstrap-formly/select/config.module#ConfigModule' },
        ]},

        // Bootstrap Specific
        { path: 'bootstrap-specific', children: [
          { path: 'advanced-layout', loadChildren: './bootstrap-specific/advanced-layout/config.module#ConfigModule' },
          { path: 'bootstrap-horizontal', loadChildren: './bootstrap-specific/bootstrap-horizontal/config.module#ConfigModule' },
          { path: 'input-add-ons', loadChildren: './bootstrap-specific/input-add-ons/config.module#ConfigModule' },
        ]},

        // Advanced
        { path: 'advanced', children: [
          { path: 'repeating-section', loadChildren: './advanced/repeating-section/config.module#ConfigModule' },
          { path: 'multi-step-form', loadChildren: './advanced/multi-step-form/config.module#ConfigModule' },
        ]},

        // Other
        { path: 'other', children: [
          { path: 'cascaded-select', loadChildren: './other/cascaded-select/config.module#ConfigModule' },
          { path: 'disable-submit-button', loadChildren: './other/disable-submit-button/config.module#ConfigModule' },
          { path: 'advanced-layout-flex', loadChildren: './other/advanced-layout-flex/config.module#ConfigModule' },
          { path: 'matching-two-fields', loadChildren: './other/matching-two-fields/config.module#ConfigModule' },
          { path: 'force-show-error', loadChildren: './other/force-show-error/config.module#ConfigModule' },
          { path: 'toggle-required', loadChildren: './other/toggle-required/config.module#ConfigModule' },
          { path: 'nested-formly-forms', loadChildren: './other/nested-formly-forms/config.module#ConfigModule' },
        ]},
      ] },
    ]),
  ],
  declarations: [
    ExamplesComponent,
  ],
})
export class ExamplesModule { }
