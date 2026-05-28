import { withFormlyFormField } from '@ngx-formly/kendo/form-field';
import { withFormlyFieldInput } from '@ngx-formly/kendo/input';
import { withFormlyFieldTextArea } from '@ngx-formly/kendo/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/kendo/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/kendo/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/kendo/select';

export function withFormlyKendo() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
