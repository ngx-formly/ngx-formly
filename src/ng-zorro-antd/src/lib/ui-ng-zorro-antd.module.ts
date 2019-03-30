import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FIELD_TYPE_COMPONENTS, NG_ZORRO_ANTD_FORMLY_CONFIG } from './ui-ng-zorro-antd.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    FormlySelectModule,
    FormlyModule.forRoot(NG_ZORRO_ANTD_FORMLY_CONFIG),
  ],
})
export class FormlyNgZorroAntdModule {}
