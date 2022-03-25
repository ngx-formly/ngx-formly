import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'date1',
      type: 'input',
      props: {
        label: 'Date (using default validator options declared in ngModule)',
        type: 'date',
      },
      validators: {
        validation: ['date-future'],
      },
    },
    {
      key: 'date2',
      type: 'input',
      props: {
        label: 'Date (passing extra params to the validator)',
        type: 'date',
      },
      validators: {
        validation: [{ name: 'date-future', options: { days: 5 } }],
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
