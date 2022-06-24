import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';

@Component({
  selector: 'formly-app-example',
  template: `
    <div class="nb-theme-default">
      <nb-layout>
        <nb-layout-column>
          <router-outlet></router-outlet>
        </nb-layout-column>
      </nb-layout>
    </div>
  `,
  styles: [
    `
      nb-layout-column {
        padding: 0 !important;
        background-color: white !important;
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit() {
    // Below line required because class "nb-theme-default" is applied on the body element
    // and it causes enter website styles conflict with other ui library styles.
    // This line removes the class "nb-theme-default" from the body element.
    this.document.body.classList.remove('nb-theme-default');
  }
}
