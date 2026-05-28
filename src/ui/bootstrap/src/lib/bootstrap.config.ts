import { withFormlyFormField } from '@ngx-formly/bootstrap/form-field';
import { withFormlyFieldInput } from '@ngx-formly/bootstrap/input';
import { withFormlyFieldTextArea } from '@ngx-formly/bootstrap/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/bootstrap/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/bootstrap/checkbox';
import { withFormlyFieldMultiCheckbox } from '@ngx-formly/bootstrap/multicheckbox';
import { withFormlyFieldSelect } from '@ngx-formly/bootstrap/select';
import { withFormlyWrapperAddons } from '@ngx-formly/bootstrap/addons';

export function withFormlyBootstrap() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldMultiCheckbox(),
    withFormlyFieldSelect(),
    withFormlyWrapperAddons(),
  ];
}
