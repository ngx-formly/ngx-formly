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
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      type: 'stepper',
      fieldGroup: [
        {
          props: { label: 'Personal data' },
          fieldGroup: [
            {
              key: 'firstname',
              type: 'input',
              props: {
                label: 'First name',
                required: true,
              },
            },
            {
              key: 'age',
              type: 'input',
              props: {
                type: 'number',
                label: 'Age',
                required: true,
              },
            },
          ],
        },
        {
          props: { label: 'Destination' },
          fieldGroup: [
            {
              key: 'country',
              type: 'input',
              props: {
                label: 'Country',
                required: true,
              },
            },
          ],
        },
        {
          props: { label: 'Day of the trip' },
          fieldGroup: [
            {
              key: 'day',
              type: 'input',
              props: {
                type: 'date',
                label: 'Day of the trip',
                required: true,
              },
            },
          ],
        },
      ],
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
