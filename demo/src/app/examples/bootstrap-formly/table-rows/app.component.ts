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
      key: 'text',
      type: 'textarea',
      templateOptions: {
        label: 'Textarea with specified rows',
        placeholder: 'This has 10 rows',
        rows: 10,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
