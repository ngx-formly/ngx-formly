import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from './shared';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { MatMenuModule } from '@angular/material/menu';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, SharedModule, MatMenuModule),
    { provide: APP_BASE_HREF, useValue: '/' },
    provideAnimations(),
    provideRouter(routes),
    provideLoadingBarRouter(),
  ],
};
