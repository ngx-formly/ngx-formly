import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});

  model = {
    lastName: 'Smith',
  };

  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      defaultValue: 'This is a default value',
      props: {
        label: 'First Name (initialized via default value)',
      },
    },
    {
      key: 'lastName',
      type: 'input',
      defaultValue: 'This is a default value',
      props: {
        label: 'Last Name (initialized via the model)',
      },
    },
    {
      key: 'candy',
      type: 'select',
      defaultValue: 'milky_way',
      props: {
        label: 'Favorite Candy (initialized via default value',
        options: [
          { label: 'Snickers', value: 'snickers' },
          { label: 'Baby Ruth', value: 'baby_ruth' },
          { label: 'Milky Way', value: 'milky_way' },
        ],
      },
    },
    {
      key: 'agree',
      type: 'checkbox',
      props: {
        label: 'Agree? (not initialized at all)',
        required: true,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
