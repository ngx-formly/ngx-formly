import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-ui',
  template: `
    <p>{{ ready ? 'Form ready' : 'Building form' }}</p>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <formly-form
        [model]="model"
        [fields]="fields"
        [options]="options"
        [form]="form"
        (fieldChange)="ready = true"
      ></formly-form>
    </form>
  `,
  imports: [ReactiveFormsModule, FormlyForm],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideNativeDateAdapter()],
})
export class UIComponent implements OnInit {
  ready = false;
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
