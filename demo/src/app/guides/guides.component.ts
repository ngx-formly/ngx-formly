import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-demo-examples',
  template: `
    <mat-sidenav-container style="min-height: 90% !important;">
      <mat-sidenav mode="side" opened="true" [style.width.px]="250" [fixedTopGap]="59" [fixedInViewport]="true">
        <mat-nav-list>
          <a mat-list-item  *ngFor="let link of navs" [routerLink]="link.href" routerLinkActive="active-link">
            {{ link.text }}
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="markdown github">
        <div *ngIf="route.params | async as params" [innerHtml]="contents[params.id]"></div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class GuidesComponent {
  navs = [
    { href: '/guide/getting-started', text: 'Getting started' },
    { href: '/guide/properties-options', text: 'Properties and Options' },
    { href: '/guide/validation', text: 'Validation' },
    { href: '/guide/expression-properties', text: 'Formly Expressions' },
    { href: '/guide/custom-formly-field', text: 'Custom Templates' },
    { href: '/guide/custom-formly-wrapper', text: 'Custom Wrapper' },
  ];

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
