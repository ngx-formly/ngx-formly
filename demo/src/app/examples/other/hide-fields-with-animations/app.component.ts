import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  // formly-form: disable default hide behavior
  styles: [
    `
      ::ng-deep formly-field {
        display: block !important;
      }
    `,
  ],
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      props: {
        label: 'First name',
        placeholder: 'Type in here to display the hidden field using slideInOut animation',
      },
    },
    {
      key: 'lastname',
      type: 'input',
      props: {
        label: 'Last name',
      },
      expressions: {
        hide: ({ model }) => !model.firstName,
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
