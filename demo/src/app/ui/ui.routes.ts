import { Routes } from '@angular/router';

export const uiRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'bootstrap' },
      { path: 'bootstrap', loadChildren: () => import('./ui-bootstrap/app.routes').then((m) => m.appRoutes) },
      { path: 'material', loadChildren: () => import('./ui-material/app.routes').then((m) => m.appRoutes) },
      { path: 'ionic', loadChildren: () => import('./ui-ionic/app.routes').then((m) => m.appRoutes) },
      { path: 'primeng', loadChildren: () => import('./ui-primeng/app.routes').then((m) => m.appRoutes) },
      { path: 'kendo', loadChildren: () => import('./ui-kendo/app.routes').then((m) => m.appRoutes) },
      {
        path: 'ng-zorro-antd',
        loadChildren: () => import('./ui-ng-zorro-antd/app.routes').then((m) => m.appRoutes),
      },
    ],
  },
];
