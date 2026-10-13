import { Component } from '@angular/core';
import readme from '../../../README.md?raw' with { loader: 'text' };
import { renderMarkdown } from './shared/highlight';

@Component({
  selector: 'formly-demo-home',
  template: `
    <div class="container markdown github">
      <div [innerHtml]="content"></div>
    </div>
  `,
  standalone: true,
})
export class HomeComponent {
  content = renderMarkdown(readme);
}
