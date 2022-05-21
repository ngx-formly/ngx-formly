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
      type: '#salutation',
    },
    {
      type: '#firstName',
    },
    {
      type: '#lastName',
      props: {
        label: 'Last Name!!!!',
        required: true,
      },
    },
  ];
}
