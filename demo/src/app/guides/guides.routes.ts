import { Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';

export const guidesRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  { path: 'migration', pathMatch: 'full', redirectTo: 'migration/v11' },
  { path: 'migration/:id', component: GuidesComponent },
  { path: ':id', component: GuidesComponent },
];
