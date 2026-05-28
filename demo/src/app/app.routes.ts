import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'guide', loadChildren: () => import('./guides/guides.routes').then((m) => m.guidesRoutes) },
  { path: 'ui', loadChildren: () => import('./ui/ui.routes').then((m) => m.uiRoutes) },
  { path: 'examples', loadChildren: () => import('./examples/examples.routes').then((m) => m.examplesRoutes) },
];
