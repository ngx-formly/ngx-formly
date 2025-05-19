import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-ui',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyForm],
  providers: [provideNativeDateAdapter()],
  standalone: true,
})
export class UIComponent implements OnInit {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(private config: FormlyConfig) {}

  ngOnInit() {
    this.fields = Object.keys(this.config.types).map((type) => ({
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
  }
  onSubmit() {}
}
