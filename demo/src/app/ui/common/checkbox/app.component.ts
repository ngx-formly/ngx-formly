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
      key: 'Checkbox',
      type: 'checkbox',
      props: {
        label: 'Accept terms',
        description: 'In order to proceed, please accept terms',
        pattern: 'true',
        required: true,
      },
      validation: {
        messages: {
          pattern: 'Please accept the terms',
        },
      },
    },
  ];
}
