import { Routes } from '@angular/router';
import { DocumentationComponent } from '../shared/documentation/documentation.component';
import pages from './api.generated.json';

export const apiRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'core' },
  { path: '**', component: DocumentationComponent, data: { pages } },
];
