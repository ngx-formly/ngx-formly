import { Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';

export const guidesRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  { path: ':id', component: GuidesComponent },
];
