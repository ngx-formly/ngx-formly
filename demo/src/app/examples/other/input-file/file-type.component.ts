import { Component } from '@angular/core';
import { FormlyAttributes, FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { FileValueAccessor } from './file-value-accessor';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'formly-field-file',
  template: ` <input type="file" [formControl]="formControl" [formlyAttributes]="field" /> `,
  imports: [FileValueAccessor, ReactiveFormsModule, FormlyAttributes],
})
export class FormlyFieldFile extends FieldType<FieldTypeConfig> {}
