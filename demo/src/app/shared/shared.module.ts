import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { ExamplesRouterViewerComponent } from './examples-router-viewer/examples-router-viewer.component';
import { CopierService } from './copier/copier.service';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,

    ExamplesRouterViewerComponent,
  ],
  declarations: [
    ExampleViewerComponent,
    ExamplesRouterViewerComponent,
  ],
  providers: [
    CopierService,
  ],
})
export class SharedModule { }
