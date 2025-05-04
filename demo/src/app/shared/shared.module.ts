import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { StackblitzButtonModule } from './stackblitz';
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { ExamplesRouterViewerComponent } from './examples-router-viewer/examples-router-viewer.component';
import { CopierService } from './copier/copier.service';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    StackblitzButtonModule,
    ExampleViewerComponent,
    ExamplesRouterViewerComponent,
  ],
  exports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    ExamplesRouterViewerComponent,
  ],
  providers: [CopierService],
})
export class SharedModule {}
