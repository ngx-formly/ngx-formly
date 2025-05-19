import { withFormlyFormField } from '@ngx-formly/ng-zorro-antd/form-field';
import { withFormlyFieldInput } from '@ngx-formly/ng-zorro-antd/input';
import { withFormlyFieldTextArea } from '@ngx-formly/ng-zorro-antd/textarea';
import { withFormlyFieldRadio } from '@ngx-formly/ng-zorro-antd/radio';
import { withFormlyFieldCheckbox } from '@ngx-formly/ng-zorro-antd/checkbox';
import { withFormlyFieldSelect } from '@ngx-formly/ng-zorro-antd/select';

export function withFormlyNgZorroAntd() {
  return [
    withFormlyFormField(),
    withFormlyFieldInput(),
    withFormlyFieldTextArea(),
    withFormlyFieldRadio(),
    withFormlyFieldCheckbox(),
    withFormlyFieldSelect(),
  ];
}
