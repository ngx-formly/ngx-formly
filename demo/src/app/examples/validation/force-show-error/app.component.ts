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
  options: FormlyFormOptions = {};

  model = {
    showErrorState: true,
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: 'Email',
        required: true,
      },
      validation: {
        show: true,
      },
      expressions: {
        'validation.show': 'model.showErrorState',
      },
    },
    {
      key: 'showErrorState',
      type: 'checkbox',
      props: {
        label: 'Force show error state',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
