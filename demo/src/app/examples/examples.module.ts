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
        { path: 'introduction', loadChildren: './introduction/introduction.module#IntroductionModule' },

        // Field Options
        { path: 'field-options', children: [
          { path: 'expression-properties', loadChildren: './field-options/expression-properties/expression-properties.module#ExpressionPropertiesModule' },
          { path: 'default-value', loadChildren: './field-options/default-value/default-value.module#DefaultValueModule' },
          { path: 'hide-fields', loadChildren: './field-options/hide-fields/hide-fields.module#HideFieldsModule' },
          { path: 'model-options', loadChildren: './field-options/model-options/model-options.module#ModelOptionsModule' },
        ]},

        // Form Options
        { path: 'form-options', children: [
          { path: 'reset-model', loadChildren: './form-options/reset-model/reset-model.module#ResetModelModule' },
          { path: 'form-state', loadChildren: './form-options/form-state/form-state.module#FormStateModule' },
        ]},

        // Bootstrap Formly
        { path: 'bootstrap-formly', children: [
          { path: 'table-rows', loadChildren: './bootstrap-formly/table-rows/table-rows.module#TableRowsModule' },
          { path: 'select', loadChildren: './bootstrap-formly/select/select.module#SelectModule' },
        ]},

        // Bootstrap Specific
        { path: 'bootstrap-specific', children: [
          { path: 'advanced-layout', loadChildren: './bootstrap-specific/advanced-layout/advanced-layout.module#AdvancedLayoutModule' },
          { path: 'bootstrap-horizontal', loadChildren: './bootstrap-specific/bootstrap-horizontal/bootstrap-horizontal.module#BootstrapHorizontalModule' },
          { path: 'input-add-ons', loadChildren: './bootstrap-specific/input-add-ons/input-add-ons.module#InputAddOnsModule' },
        ]},

        // Advanced
        { path: 'advanced', children: [
          { path: 'repeating-section', loadChildren: './advanced/repeating-section/repeating-section.module#RepeatingSectionModule' },
        ]},

        // Other
        { path: 'other', children: [
          { path: 'cascaded-select', loadChildren: './other/cascaded-select/cascaded-select.module#CascadedSelectModule' },
        ]},
      ] },
    ]),
  ],
  declarations: [
    ExamplesComponent,
  ],
})
export class ExamplesModule { }
