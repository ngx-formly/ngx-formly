import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ExampleViewerComponent } from '../example-viewer/example-viewer.component';

@Component({
  selector: 'formly-examples-viewer',
  template: `
    <ng-container *ngIf="router.data | async as data">
      <formly-example-viewer
        *ngFor="let exampleData of data.examples"
        [type]="data.type"
        [debugFields]="data.debugFields"
        [exampleData]="exampleData"
      >
      </formly-example-viewer>
    </ng-container>
  `,
  standalone: true,
  imports: [NgIf, NgFor, ExampleViewerComponent, AsyncPipe],
})
export class ExamplesRouterViewerComponent {
  constructor(public router: ActivatedRoute) {}
}
