import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      disabled: true,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
      templateOptions: {
        label: 'First Name',
      },
    },
    {
      key: 'text',
      type: 'checkbox',
      templateOptions: {
        label: 'I agree',
      },
    },
    {
      key: 'text',
      type: 'textarea',
      templateOptions: {
        label: 'Thoughts...',
      },
    },
  ];

  ngOnInit() {
    // apply expressionProperty for disabled based on formState to all fields
    this.fields.forEach(field => {
      field.expressionProperties = field.expressionProperties || {};
      field.expressionProperties['templateOptions.disabled'] = 'formState.disabled';
    });
  }

  toggleDisabled() {
    this.options.formState.disabled = !this.options.formState.disabled;
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
