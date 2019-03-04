import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { NG_ZORRO_ANTD_FORMLY_CONFIG, FIELD_TYPE_COMPONENTS } from './ui-ng-zorro-antd.config';

@NgModule({
  declarations: FIELD_TYPE_COMPONENTS,
  imports: [
    CommonModule,

    NgZorroAntdModule,

    ReactiveFormsModule,
    FormlySelectModule,
    FormlyModule.forRoot(NG_ZORRO_ANTD_FORMLY_CONFIG),
  ],
})
export class FormlyNgZorroAntdModule {}
