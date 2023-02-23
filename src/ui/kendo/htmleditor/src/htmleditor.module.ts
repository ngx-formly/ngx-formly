import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';

import { FormlyFieldHtmlEditor } from './htmleditor.type';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';

@NgModule({
  declarations: [FormlyFieldHtmlEditor],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorModule,
    FormlyFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'htmleditor',
          component: FormlyFieldHtmlEditor,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyHtmlEditorModule {}
