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
    firstName: 'Chuck',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [this.formlyJsonschema.toFieldConfig({
    'title': 'A registration form',
    'description': 'A simple form example.',
    'type': 'object',
    'required': [
      'firstName',
      'lastName',
    ],
    'properties': {
      'firstName': {
        'type': 'string',
        'title': 'First name',
      },
      'lastName': {
        'type': 'string',
        'title': 'Last name',
      },
      'age': {
        'type': 'integer',
        'title': 'Age',
      },
      'bio': {
        'type': 'string',
        'title': 'Bio',
      },
      'password': {
        'type': 'string',
        'title': 'Password',
        'minLength': 3,
      },
      'telephone': {
        'type': 'string',
        'title': 'Telephone',
        'minLength': 10,
      },
    },
  })];

  constructor(private formlyJsonschema: FormlyJsonschema) {}

  submit() {
    alert(JSON.stringify(this.model));
  }
}
