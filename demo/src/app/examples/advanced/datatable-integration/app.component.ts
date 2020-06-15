import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any;
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Personal data</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            label: 'Name',
            required: true,
          },
        },
        {
          key: 'surname',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            label: 'Surname',
            required: true,
          },
        },
      ],
    },
    {
      key: 'investments',
      type: 'datatable',
      templateOptions: {
        columns: [
          { name: 'Name of Investment', prop: 'investmentName' },
          { name: 'Date of Investment', prop: 'investmentDate' },
          { name: 'Stock Identifier', prop: 'stockIdentifier' },
        ],
      },
      fieldArray: {
        fieldGroup: [
          {
            type: 'input',
            key: 'investmentName',
            templateOptions: {
              required: true,
            },
          },
          {
            type: 'input',
            key: 'investmentDate',
            templateOptions: {
              type: 'date',
            },
          },
          {
            type: 'input',
            key: 'stockIdentifier',
            templateOptions: {
              label: 'Stock Identifier:',
            },
          },
        ],
      },
    },
  ];

  constructor() {
    this.fetch((data) => (this.model = data));
  }

  submit() {
    alert(JSON.stringify(this.model));
  }

  fetch(cb) {
    cb({
      name: 'name1',
      surname: 'surname1',
      investments: [
        {
          investmentName: 'project1',
          investmentDate: '',
          stockIdentifier: 1,
        },
        {
          investmentName: 'project2',
          investmentDate: '',
          stockIdentifier: 2,
        },
        {
          investmentName: 'project3',
          investmentDate: '',
          stockIdentifier: 3,
        },
      ],
    });
  }
}
