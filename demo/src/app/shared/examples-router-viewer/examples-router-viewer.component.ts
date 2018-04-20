import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-examples-viewer',
  template: `
    <ng-container *ngIf="router.data | async as data">
      <formly-example-viewer *ngFor="let example of data.examples"
        [title]="example.title"
        [description]="example.description"
        [debug]="example.debug"
        [component]="example.component"
        [example]="example.files">
      </formly-example-viewer>
    </ng-container>
  `,
})
export class ExamplesRouterViewerComponent {
  constructor(public router: ActivatedRoute) {}
}
