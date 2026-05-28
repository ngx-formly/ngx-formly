import { Directive, Injectable, Input, OnChanges, QueryList, TemplateRef } from '@angular/core';

@Directive({ selector: '[formlyTemplate]', standalone: true })
export class FormlyTemplate implements OnChanges {
  @Input('formlyTemplate') name: string;

  constructor(public ref: TemplateRef<any>) {}

  ngOnChanges() {
    this.name = this.name || 'formly-group';
  }
}

@Directive({ selector: '[formlyTemplate]', standalone: false })
export class LegacyFormlyTemplate extends FormlyTemplate {}

// workarround for https://github.com/angular/angular/issues/43227#issuecomment-904173738
@Injectable()
export class FormlyFieldTemplates {
  templates!: QueryList<FormlyTemplate>;
}
