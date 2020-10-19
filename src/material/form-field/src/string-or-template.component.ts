import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'formly-string-or-template',
  template: `
    <ng-container *ngIf="contentString; else template">{{ contentString }}</ng-container>
    <ng-template #template>
      <ng-container *ngTemplateOutlet="templateRef"></ng-container>
    </ng-template>
  `,
})
export class StringOrTemplateComponent {
  contentString: null | string = null;
  templateRef: null | TemplateRef<any> = null;

  @Input() set content(content: string | TemplateRef<any>) {
    if (content == null) {
      this.templateRef = null;
      this.contentString = null;
    } else if (typeof content === 'string') {
      this.templateRef = null;
      this.contentString = content;
    } else if (typeof content === 'object') {
      this.contentString = null;
      this.templateRef = content;
    }
  }
}
