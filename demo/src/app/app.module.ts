import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { SharedModule } from './shared';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { filter, tap } from 'rxjs/operators';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    LoadingBarRouterModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'guide', loadChildren: './guides/guides.module#GuidesModule' },
      { path: 'ui', loadChildren: './ui/ui.module#UIModule' },
      { path: 'examples', loadChildren: './examples/examples.module#ExamplesModule' },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    router.events.pipe(
      filter(evt => evt instanceof NavigationEnd),
      tap(() => document.querySelector('.mat-sidenav-content').scrollTop = 0),
    ).subscribe();
  }
}
