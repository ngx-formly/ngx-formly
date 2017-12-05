import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { SharedModule } from './shared';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    LoadingBarRouterModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'examples/introduction' },
      { path: 'examples', loadChildren: './examples/examples.module#ExamplesModule' },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
