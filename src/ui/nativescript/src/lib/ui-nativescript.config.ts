import { withFormlyFormField } from '@ngx-formly/nativescript/form-field';
import { withFormlyFieldTextArea } from '@ngx-formly/nativescript/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/nativescript/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/nativescript/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/nativescript/select';
import { withFormlyFieldInput } from '@ngx-formly/nativescript/text-field';

export function withFormlyNativescript() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
