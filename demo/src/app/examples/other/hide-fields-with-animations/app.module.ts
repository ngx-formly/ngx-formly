import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AnimationWrapperComponent } from './animation-wrapper.component';
import { AppComponent } from './app.component';

export class AnimationWrapper {
  run(fc) {
    fc.templateManipulators.preWrapper
      .push(field => 'animation');
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'animation', component: AnimationWrapperComponent },
      ],
      manipulators: [
        { class: AnimationWrapper, method: 'run' },
      ],
    }),
  ],
  declarations: [
    AppComponent,
    AnimationWrapperComponent,
  ],
})
export class AppModule { }
