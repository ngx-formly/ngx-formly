import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'formly-app-example',
  template: `<div class="p-fluid"><router-outlet></router-outlet></div>`,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
