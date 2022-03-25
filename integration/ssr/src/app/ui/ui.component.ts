import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-ui',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
    </form>
  `,
})
export class UIComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = Object.keys(this.config.types).map((type) => ({
    key: type,
    type,
    props: {
      label: `${type} label`,
      placeholder: `${type} placeholder`,
      description: `${type} description`,
      options: [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
        { value: 3, label: 'Option 3' },
        { value: 4, label: 'Option 4' },
      ],
    },
  }));

  constructor(private config: FormlyConfig) {}

  onSubmit() {}
}
