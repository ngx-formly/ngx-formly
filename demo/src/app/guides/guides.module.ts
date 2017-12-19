import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

import { GuidesComponent } from './guides.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
      { path: ':id', component: GuidesComponent },
    ]),
  ],
  declarations: [
    GuidesComponent,
  ],
})
export class GuidesModule { }
