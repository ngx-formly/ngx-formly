import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'formly-app-example',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
