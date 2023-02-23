import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { KendoGridComponent } from './grid.type';

import { GridModule } from '@progress/kendo-angular-grid';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { GridDisplayPipe } from './grid.display.pipe';
import { GridFieldGroupPipe } from './grid.fieldgroup.pipe';
import { GridKeyPipe } from './grid.key.pipe';

@NgModule({
  declarations: [
    KendoGridComponent,
    GridDisplayPipe,
    GridFieldGroupPipe,
    GridKeyPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GridModule,

    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'grid',
          component: KendoGridComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyGridModule {}
