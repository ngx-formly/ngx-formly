import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';

@Directive({ selector: '[formlyTemplate]' })
export class FormlyTemplate implements OnChanges {
  @Input('formlyTemplate') name: string;

  constructor(public ref: TemplateRef<any>) {}

  ngOnChanges() {
    this.name = this.name || 'formly-group';
  }
}
