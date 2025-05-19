import { withFormlyFormField } from '@ngx-formly/primeng/form-field';
import { withFormlyFieldInput } from '@ngx-formly/primeng/input';
import { withFormlyFieldTextArea } from '@ngx-formly/primeng/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/primeng/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/primeng/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/primeng/select';

export function withFormlyPrimeNG() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
