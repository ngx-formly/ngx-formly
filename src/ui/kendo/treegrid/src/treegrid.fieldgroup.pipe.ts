import { Pipe, PipeTransform } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isFormlyFieldConfig } from './form.array.util';

@Pipe({
  name: 'treegridFieldGroup',
  pure: false,
})
export class TreeGridFieldGroupPipe implements PipeTransform {
  transform(value: FormlyFieldConfig): FormlyFieldConfig[] | undefined {
    if (value.fieldArray) {
      if (isFormlyFieldConfig(value.fieldArray)) {
        return value.fieldArray.fieldGroup;
      } else {
        return value.fieldArray(value).fieldGroup;
      }
    }
    return [];
  }
}
