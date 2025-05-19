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
      props: { label: 'Personal data' },
      fieldGroup: [
        {
          key: 'input',
          type: 'input',
          props: {
            label: 'Input Field',
          },
        },
        {
          key: 'default-password',
          type: 'password',
        },
        {
          key: 'customized-password',
          type: 'password',
          props: {
            label: 'Password Field (with custom label)',
          },
        },
      ],
    },
  ];
}
