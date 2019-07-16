import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {
    'number': 3.14,
    'integer': 42,
    'numberEnum': 2,
    'integerRange': 42,
    'integerRangeSteps': 80,
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [this.formlyJsonschema.toFieldConfig({
    'type': 'object',
    'title': 'Number fields & widgets',
    'properties': {
      'number': {
        'title': 'Number',
        'type': 'number',
      },
      'integer': {
        'title': 'Integer',
        'type': 'integer',
      },
      'numberEnum': {
        'type': 'number',
        'title': 'Number enum',
        'enum': [
          1,
          2,
          3,
        ],
      },
      'numberEnumRadio': {
        'type': 'number',
        'title': 'Number enum',
        'enum': [
          1,
          2,
          3,
        ],
      },
      'integerRange': {
        'title': 'Integer range',
        'type': 'integer',
        'minimum': 42,
        'maximum': 100,
      },
      'integerRangeSteps': {
        'title': 'Integer range (by 10)',
        'type': 'integer',
        'minimum': 50,
        'maximum': 100,
        'multipleOf': 10,
      },
    },
  })];

  constructor(private formlyJsonschema: FormlyJsonschema) {}

  submit() {
    alert(JSON.stringify(this.model));
  }
}
