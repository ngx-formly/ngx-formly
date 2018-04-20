import { Component } from '@angular/core';

@Component({
  selector: 'formly-ui-bootstrap',
  template: `
  <mat-sidenav-container style="min-height: 90% !important;" class="mat-typography">
    <mat-sidenav mode="side" opened="true" [style.width.px]="250">
      <mat-nav-list>
        <a mat-list-item  *ngFor="let link of navs" [routerLink]="link.href">
          {{ link.text }}
        </a>
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
      <router-outlet></router-outlet>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
})
export class UIComponent {
  navs = [
    { href: '/ui/bootstrap', text: 'Bootstrap' },
    { href: '/ui/material', text: 'Material' },
    { href: '/ui/ionic', text: 'Ionic' },
    { href: '/ui/primeng', text: 'PrimeNG' },
    { href: '/ui/kendo', text: 'Kendo' },
  ];
}
