import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap/';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { GridTypeComponent } from './grid.type';
import { GridFormlyCellComponent } from './grid-formly-cell.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    AgGridModule.withComponents([GridFormlyCellComponent]),
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'grid',
          component: GridTypeComponent,
          defaultOptions: {
            templateOptions: {
              width: '100%',
              height: '400px',
            },
          },
        },
      ],
    }),
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GridTypeComponent,
    GridFormlyCellComponent,
  ],
})
export class AppModule { }
