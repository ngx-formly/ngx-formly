import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'formly-examples-viewer',
  template: `
    <formly-example-viewer *ngFor="let example of examples" [title]="example.title" [description]="example.description" [example]="example.files">
      <ng-template [portalHost]="example.portalHost"></ng-template>
    </formly-example-viewer>
  `,
})
export class ExamplesRouterViewerComponent {
  examples;
  selectedPortal;

  constructor(router: ActivatedRoute) {
    router.data.subscribe(data => {
      this.examples = data.examples.map(e => ({
        ...e,
        portalHost: new ComponentPortal(e.component),
      }));
    });
  }
}
