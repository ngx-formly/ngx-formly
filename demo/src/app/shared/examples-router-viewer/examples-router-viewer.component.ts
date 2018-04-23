import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-examples-viewer',
  template: `
    <ng-container *ngIf="router.data | async as data">
      <formly-example-viewer *ngFor="let exampleData of data.examples"
        [type]="type"
        [exampleData]="exampleData">
      </formly-example-viewer>
    </ng-container>
  `,
})
export class ExamplesRouterViewerComponent {
  type;

  constructor(public router: ActivatedRoute) {
    let r = router;
    while (!r.routeConfig.path) {
      r = r.parent;
    }

    this.type = r.routeConfig.path;
  }
}
