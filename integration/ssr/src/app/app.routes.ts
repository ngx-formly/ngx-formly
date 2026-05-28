import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'bootstrap', loadChildren: () => import('./ui/bootstrap.config').then((m) => m.appRoutes) },
      { path: 'material', loadChildren: () => import('./ui/material.config').then((m) => m.appRoutes) },
      { path: 'primeng', loadChildren: () => import('./ui/primeng.config').then((m) => m.appRoutes) },
      { path: 'kendo', loadChildren: () => import('./ui/kendo.config').then((m) => m.appRoutes) },
      {
        path: 'antd',
        loadChildren: () => import('./ui/antd.config').then((m) => m.appRoutes),
      },
    ],
  },
];
