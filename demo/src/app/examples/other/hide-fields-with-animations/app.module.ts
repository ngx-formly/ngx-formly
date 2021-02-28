import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AnimationWrapperComponent } from './animation-wrapper.component';
import { AppComponent } from './app.component';

export function animationExtension(field: FormlyFieldConfig) {
  if (field.wrappers && field.wrappers.includes('animation')) {
    return;
  }

  field.wrappers = ['animation', ...(field.wrappers || [])];
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      extras: { lazyRender: false },
      wrappers: [{ name: 'animation', component: AnimationWrapperComponent }],
      extensions: [{ name: 'animation', extension: { onPopulate: animationExtension } }],
    }),
  ],
  declarations: [AppComponent, AnimationWrapperComponent],
})
export class AppModule {}
