import { NgModule } from '@angular/core';
import { FormlyFormFieldModule } from '@ngx-formly/kendo/form-field';
import { FormlyInputModule } from '@ngx-formly/kendo/input';
import { FormlyTextAreaModule } from '@ngx-formly/kendo/textarea';
import { FormlyRadioModule } from '@ngx-formly/kendo/radio';
import { FormlyCheckboxModule } from '@ngx-formly/kendo/checkbox';
import { FormlySelectModule } from '@ngx-formly/kendo/select';
import { FormlyGridModule } from '@ngx-formly/kendo/grid';
import { FormlyTreeGridModule } from '@ngx-formly/kendo/treegrid';
import { FormlyComboBoxModule } from '@ngx-formly/kendo/combobox';
import { FormlyHtmlEditorModule } from '@ngx-formly/kendo/htmleditor';
import { FormlyMultiSelectModule } from '@ngx-formly/kendo/multiselect';

@NgModule({
  imports: [
    FormlyFormFieldModule,
    FormlyInputModule,
    FormlyTextAreaModule,
    FormlyRadioModule,
    FormlyCheckboxModule,
    FormlySelectModule,
    FormlyGridModule,
    FormlyTreeGridModule,
    FormlyComboBoxModule,
    FormlyHtmlEditorModule,
    FormlyMultiSelectModule
  ],
})
export class FormlyKendoModule {}
