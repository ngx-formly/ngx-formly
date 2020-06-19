import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-template',
  template: `<div [innerHtml]="template"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyTemplateType extends FieldType {
  get template() {
    if (this.field && this.field.template !== this.innerHtml.template) {
      this.innerHtml = {
        template: this.field.template,
        content: this.to.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template,
      };
    }

    return this.innerHtml.content;
  }

  private innerHtml = { content: null, template: null };
  constructor(private sanitizer: DomSanitizer) {
    super();
  }
}
