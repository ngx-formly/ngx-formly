import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'formly-demo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [JsonPipe, ReactiveFormsModule, RouterLink, MatIcon, FormlyForm],
  standalone: true,
})
export class HomeComponent {
  form = new FormGroup({});
  model = { name: 'Alex', email: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name', required: true },
    },
    {
      key: 'email',
      type: 'input',
      props: { label: 'Email', type: 'email' },
    },
  ];
  schema = JSON.stringify(this.fields, null, 2);
  schemaError = '';

  updateSchema(source: string) {
    this.schema = source;
    let fields: FormlyFieldConfig[];
    try {
      fields = JSON.parse(source);
    } catch {
      this.schemaError = 'Use valid JSON. The preview keeps your last working configuration.';
      return;
    }

    // Only pass plain input configuration to Formly; executable expressions stay out of this example.
    const valid =
      Array.isArray(fields) &&
      fields.every(
        (field) =>
          field &&
          typeof field.key === 'string' &&
          /^[a-zA-Z_]\w*$/.test(field.key) &&
          !['__proto__', 'constructor', 'prototype'].includes(field.key) &&
          field.type === 'input' &&
          Object.keys(field).every((key) => ['key', 'type', 'props'].includes(key)) &&
          field.props &&
          typeof field.props.label === 'string' &&
          field.props.label.trim().length > 0 &&
          Object.keys(field.props).every((key) => ['label', 'type', 'required', 'placeholder'].includes(key)) &&
          (field.props.type === undefined || ['text', 'email', 'tel', 'url', 'password'].includes(field.props.type)) &&
          (field.props.required === undefined || typeof field.props.required === 'boolean') &&
          (field.props.placeholder === undefined || typeof field.props.placeholder === 'string'),
      ) &&
      new Set(fields.map((field) => field.key)).size === fields.length;

    if (!valid) {
      this.schemaError =
        'Use input fields with unique, simple keys and props for label, type, required or placeholder.';
      return;
    }

    this.schemaError = '';
    this.fields = fields;
  }
}
