import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let link of links">
        <a [routerLink]="link">{{ link }}</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  links = ['material', 'bootstrap', 'kendo', 'primeng', 'antd'];
}
