import { NgModule } from '@angular/core';

import { FormlyNzFormFieldModule } from '@ngx-formly/ng-zorro-antd/form-field';
import { FormlyNzInputModule } from '@ngx-formly/ng-zorro-antd/input';
import { FormlyNzTextAreaModule } from '@ngx-formly/ng-zorro-antd/textarea';
import { FormlyNzRadioModule } from '@ngx-formly/ng-zorro-antd/radio';
import { FormlyNzCheckboxModule } from '@ngx-formly/ng-zorro-antd/checkbox';
import { FormlyNzSelectModule } from '@ngx-formly/ng-zorro-antd/select';

@NgModule({
  imports: [
    FormlyNzFormFieldModule,
    FormlyNzInputModule,
    FormlyNzTextAreaModule,
    FormlyNzRadioModule,
    FormlyNzCheckboxModule,
    FormlyNzSelectModule,
  ],
})
export class FormlyNgZorroAntdModule {}
