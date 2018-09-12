import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model = {
    investments: [{}],
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'investments',
      type: 'repeat',
      templateOptions: {
        addText: 'Add another investment',
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-sm-4',
            type: 'input',
            key: 'investmentName',
            templateOptions: {
              label: 'Name of Investment:',
              required: true,
            },
          },
          {
            type: 'input',
            key: 'investmentDate',
            className: 'col-sm-4',
            templateOptions: {
              type: 'date',
              label: 'Date of Investment:',
            },
          },
          {
            type: 'input',
            key: 'stockIdentifier',
            className: 'col-sm-4',
            templateOptions: {
              label: 'Stock Identifier:',
              addonRight: {
                class: 'fa fa-code',
                onClick: (to, fieldType, $event) => console.log(to, fieldType, $event),
              },
            },
          },
        ],
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
