import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-demo-examples',
  template: `
    <div class="markdown github">
      <div *ngIf="route.params | async as params" [innerHtml]="contents[params.id]"></div>
    </div>
  `,
})
export class GuidesComponent {
  contents = {
    'getting-started': require('!!raw-loader!!highlight-loader!markdown-loader!./../../../../README.md'),
    'properties-options': require('!!raw-loader!!highlight-loader!markdown-loader!./properties-options.md'),
    'custom-formly-field': require('!!raw-loader!!highlight-loader!markdown-loader!./custom-formly-field.md'),
    'custom-formly-wrapper': require('!!raw-loader!!highlight-loader!markdown-loader!./custom-formly-wrapper.md'),
    'validation': require('!!raw-loader!!highlight-loader!markdown-loader!./validation.md'),
    'expression-properties': require('!!raw-loader!!highlight-loader!markdown-loader!./expression-properties.md'),
  };

  constructor(public route: ActivatedRoute) {}
}
