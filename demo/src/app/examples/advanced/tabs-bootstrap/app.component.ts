import { Component } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      type: 'tabBootstrap',
      fieldGroup: [
        {
          fieldGroup: [
            {
              key: 'firstname',
              type: 'input',
              templateOptions: {
                label: 'First name',
                required: true,
              },
            },
            {
              key: 'age',
              type: 'input',
              templateOptions: {
                type: 'number',
                label: 'Age',
                required: true,
              },
            },
          ],
          templateOptions: {
            label: 'Personal data',
          },
        },
        {
          fieldGroup: [
            {
              key: 'country',
              type: 'input',
              templateOptions: {
                label: 'Country',
                required: true,
              },
            },
          ],
          templateOptions: {
            label: 'Destination',
          },
        },
        {
          fieldGroup: [
            {
              key: 'day',
              type: 'input',
              templateOptions: {
                type: 'date',
                label: 'Day of the trip',
                required: true,
              },
            },
          ],
          templateOptions: {
            label:  'Day of the trip',
          },
        },
      ],
    },
  ];

  constructor() {
  }


}


