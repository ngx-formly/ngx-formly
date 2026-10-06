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
import { IonicModule } from '@ionic/angular';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, SharedModule, MatMenuModule, IonicModule.forRoot()),
    { provide: APP_BASE_HREF, useValue: '/' },
    provideAnimations(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: false } } }),
    provideNzI18n(en_US),
    provideRouter(routes),
    provideLoadingBarRouter(),
  ],
};
