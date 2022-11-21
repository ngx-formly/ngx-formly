import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { FormlyModule } from '@ngx-formly/core';

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
    FormlyModule,
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
  declarations: [ExampleViewerComponent, ExamplesRouterViewerComponent],
  providers: [CopierService],
})
export class SharedModule {}
