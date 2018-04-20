import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

import { UIComponent } from './ui.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: UIComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'bootstrap' },
        { path: 'bootstrap', loadChildren: './ui-bootstrap/config.module#ConfigModule' },
        { path: 'material', loadChildren: './ui-material/config.module#ConfigModule' },
        { path: 'ionic', loadChildren: './ui-ionic/config.module#ConfigModule' },
        { path: 'primeng', loadChildren: './ui-primeng/config.module#ConfigModule' },
        { path: 'kendo', loadChildren: './ui-kendo/config.module#ConfigModule' },
      ] },
    ]),
  ],
  declarations: [
    UIComponent,
  ],
})
export class UIModule { }
