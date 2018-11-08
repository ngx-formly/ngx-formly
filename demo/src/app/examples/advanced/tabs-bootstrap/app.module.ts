import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { TabTypeComponent } from './tab-type.component'

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,  
    FormlyBootstrapModule,
    NgbModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      types: [
          { name: 'tabBootstrap', component: TabTypeComponent },
      ]
    }),
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TabTypeComponent
  ],
  exports:[ TabTypeComponent ]
})
export class AppModule { }
