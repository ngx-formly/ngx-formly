import { ConfigOption } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/ionic/form-field';
import { withFormlyFieldInput } from '@ngx-formly/ionic/input';
import { withFormlyFieldTextArea } from '@ngx-formly/ionic/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/ionic/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/ionic/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/ionic/select';

export function withFormlyIonic(): ConfigOption[] {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
