import { Routes } from '@angular/router';
import { DocumentationComponent } from '../shared/documentation/documentation.component';
import { GUIDE_PAGES } from './guides.pages';

export const guidesRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  { path: 'migration', pathMatch: 'full', redirectTo: 'migration/v11' },
  { path: 'migration/:id', component: DocumentationComponent, data: { pages: GUIDE_PAGES } },
  { path: ':id', component: DocumentationComponent, data: { pages: GUIDE_PAGES } },
];
