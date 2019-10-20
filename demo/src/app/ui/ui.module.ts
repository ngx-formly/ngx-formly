import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'bootstrap' },
          { path: 'bootstrap', loadChildren: () => import('./ui-bootstrap/config.module').then(m => m.ConfigModule) },
          { path: 'material', loadChildren: () => import('./ui-material/config.module').then(m => m.ConfigModule) },
          { path: 'ionic', loadChildren: () => import('./ui-ionic/config.module').then(m => m.ConfigModule) },
          { path: 'primeng', loadChildren: () => import('./ui-primeng/config.module').then(m => m.ConfigModule) },
          { path: 'kendo', loadChildren: () => import('./ui-kendo/config.module').then(m => m.ConfigModule) },
        ],
      },
    ]),
  ],
})
export class UIModule {}
