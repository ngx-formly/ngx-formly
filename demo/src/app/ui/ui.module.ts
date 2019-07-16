import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', children: [
        { path: '', pathMatch: 'full', redirectTo: 'bootstrap' },
        { path: 'bootstrap', loadChildren: './ui-bootstrap/config.module#ConfigModule' },
        { path: 'material', loadChildren: './ui-material/config.module#ConfigModule' },
        { path: 'ionic', loadChildren: './ui-ionic/config.module#ConfigModule' },
        { path: 'primeng', loadChildren: './ui-primeng/config.module#ConfigModule' },
        { path: 'kendo', loadChildren: './ui-kendo/config.module#ConfigModule' },
      ] },
    ]),
  ],
})
export class UIModule { }
