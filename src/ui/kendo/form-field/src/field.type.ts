import { Directive, ViewChildren, QueryList } from '@angular/core';
import { FormlyFieldConfig, FieldType as CoreFieldType } from '@ngx-formly/core';
import { NgControl } from '@angular/forms';
import { FormFieldComponent } from '@progress/kendo-angular-inputs';

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> extends CoreFieldType<F> {
  @ViewChildren(NgControl) private set formControls(formControls: QueryList<NgControl>) {
    if (this.formField) {
      this.formField['control'] = formControls.first;
    }
  }

  private get formField(): FormFieldComponent {
    return (this.field as any)?.['_formField'];
  }
}
