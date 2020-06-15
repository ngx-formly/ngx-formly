import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,

    RouterModule.forRoot([
      { path: 'material', loadChildren: () => import('./ui/material.module').then((m) => m.UIMaterialModule) },
      { path: 'bootstrap', loadChildren: () => import('./ui/bootstrap.module').then((m) => m.UIBootstrapModule) },
      { path: 'kendo', loadChildren: () => import('./ui/kendo.module').then((m) => m.UIKendoModule) },
      { path: 'primeng', loadChildren: () => import('./ui/primeng.module').then((m) => m.UIPrimengModule) },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
