import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ExampleViewerComponent } from '../example-viewer/example-viewer.component';

@Component({
  selector: 'formly-examples-viewer',
  template: `
    @if (router.data | async; as data) {
      @for (exampleData of data.examples; track exampleData) {
        <formly-example-viewer [type]="data.type" [debugFields]="data.debugFields" [exampleData]="exampleData">
        </formly-example-viewer>
      }
    }
  `,
  imports: [ExampleViewerComponent, AsyncPipe],
})
export class ExamplesRouterViewerComponent {
  constructor(public router: ActivatedRoute) {}
}
