import { Component, ViewEncapsulation } from '@angular/core';
import { ExamplesRouterViewerComponent } from '../../shared/examples-router-viewer/examples-router-viewer.component';

@Component({
  selector: 'formly-app-example',
  template: ` <formly-examples-viewer></formly-examples-viewer> `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ExamplesRouterViewerComponent],
})
export class AppComponent {}
