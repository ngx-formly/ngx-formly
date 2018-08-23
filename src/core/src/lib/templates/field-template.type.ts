import { Component } from '@angular/core';
import { FieldType } from './field.type';

@Component({
  selector: 'formly-template',
  template: `<div [innerHtml]="field.template"></div>`,
})
export class FormlyTemplateType extends FieldType {}
