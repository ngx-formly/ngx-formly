import { withFormlyFormField } from '@ngx-formly/optimus-ui/form-field';
import { withFormlyFieldInput } from '@ngx-formly/optimus-ui/input';
import { withFormlyFieldTextArea } from '@ngx-formly/optimus-ui/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/optimus-ui/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/optimus-ui/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/optimus-ui/select';

export function withFormlyOptimusUI() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
