import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { KendoTreeGridComponent } from './treegrid.type';

import { TreeListModule } from '@progress/kendo-angular-treelist';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { TreeGridFieldGroupPipe } from './treegrid.fieldgroup.pipe';
import { TreeGridKeyPipe } from './treegrid.key.pipe';

@NgModule({
  declarations: [
    KendoTreeGridComponent,
    TreeGridFieldGroupPipe,
    TreeGridKeyPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TreeListModule,

    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'treegrid',
          component: KendoTreeGridComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyTreeGridModule {}
