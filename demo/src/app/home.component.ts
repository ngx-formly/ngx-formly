import { Component } from '@angular/core';

@Component({
  selector: 'formly-demo-home',
  template: `
    <div class="container markdown github">
      <div [innerHtml]="contnent.default"></div>
    </div>
  `,
  standalone: true,
})
export class HomeComponent {
  contnent = require('!!raw-loader!!highlight-loader!markdown-loader!./../../../README.md');
}
