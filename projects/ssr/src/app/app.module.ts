import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,

    RouterModule.forRoot([
      { path: 'material', loadChildren: './ui/material.module#UIMaterialModule' },
      { path: 'bootstrap', loadChildren: './ui/bootstrap.module#UIBootstrapModule' },
      { path: 'kendo', loadChildren: './ui/kendo.module#UIKendoModule' },
      { path: 'primeng', loadChildren: './ui/primeng.module#UIPrimengModule' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
