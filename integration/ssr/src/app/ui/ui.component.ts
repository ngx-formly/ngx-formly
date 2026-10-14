import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-ui',
  template: `
    <p>{{ ready ? 'Form ready' : 'Building form' }}</p>
    <button type="button" data-test="toggle-html" [attr.aria-pressed]="allowHtml" (click)="toggleHtml()">
      Toggle HTML
    </button>
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
  providers: [provideNativeDateAdapter()],
})
export class UIComponent implements OnInit {
  ready = false;
  allowHtml = true;
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private config: FormlyConfig,
    private location: Location,
  ) {}

  ngOnInit() {
    const termsUrl = `${this.location.path().split('#')[0]}#terms`;
    this.fields = Object.keys(this.config.types).map((type) => ({
      key: type,
      type,
      className: `field-${type}`,
      defaultValue: type === 'checkbox' || type === 'toggle' ? false : undefined,
      props: {
        label: ['checkbox', 'toggle', 'select', 'datetime'].includes(type)
          ? `Accept <a class="html-label" href="${termsUrl}"><strong>${type} label</strong></a>`
          : `<strong class="html-label">${type} label</strong>`,
        placeholder: `${type} placeholder`,
        description: `<a class="html-description" href="${termsUrl}">${type} description</a>`,
        allowHtml: this.allowHtml,
        options: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
          { value: 4, label: 'Option 4' },
        ],
      },
    }));
  }

  toggleHtml() {
    this.allowHtml = !this.allowHtml;
    this.fields.forEach((field) => {
      field.props.allowHtml = this.allowHtml;
      this.options.detectChanges(field);
    });
  }

  onSubmit() {}
}
