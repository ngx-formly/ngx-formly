import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';
import { withFormlyFieldTextArea } from '@ngx-formly/material/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/material/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/material/checkbox';
import { withFormlyFieldMultiCheckbox } from '@ngx-formly/material/multicheckbox';
import { withFormlyFieldSelect } from '@ngx-formly/material/select';

export function withFormlyMaterial() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldMultiCheckbox(),
    withFormlyFieldSelect(),
  ];
}
