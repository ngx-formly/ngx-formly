import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'Checkbox',
      type: 'checkbox',
      templateOptions: {
        label: 'Checkbox',
        placeholder: 'Placeholder',
        description: 'Description',
        required: true,
      },
    },
  ];
}
