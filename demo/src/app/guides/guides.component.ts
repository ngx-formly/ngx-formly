import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-demo-examples',
  template: `
    <div class="container">
      <div *ngIf="route.params | async as params" [innerHtml]="contents[params.id]"></div>
    </div>
  `,
})
export class GuidesComponent {
  contents = {
    'getting-started': require('!!raw-loader!prism-hightlight-loader!markdown-loader!./../../../../README.md'),
  };

  constructor(public route: ActivatedRoute) {}
}
