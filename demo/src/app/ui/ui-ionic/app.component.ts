import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'formly-app-example',
  template: `
    <formly-examples-viewer></formly-examples-viewer>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
