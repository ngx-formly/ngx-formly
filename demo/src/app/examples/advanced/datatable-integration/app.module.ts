import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap/';

import { AppComponent } from './app.component';
import { DatatableTypeComponent } from './datatable.type';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    NgxDatatableModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'datatable',
          component: DatatableTypeComponent,
          defaultOptions: {
            templateOptions: {
              columnMode: 'force',
              rowHeight: 'auto',
              headerHeight: '40',
              footerHeight: '40',
              limit: '10',
              scrollbarH: 'true',
              reorderable: 'reorderable',
            },
          },
        },
      ],
    }),
  ],
  declarations: [AppComponent, DatatableTypeComponent],
})
export class AppModule {}
