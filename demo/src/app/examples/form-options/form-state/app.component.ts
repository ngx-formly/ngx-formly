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
  options: FormlyFormOptions = {
    formState: {
      disabled: true,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
      props: {
        label: 'First Name',
      },
      expressions: {
        // apply expressionProperty for disabled based on formState
        'props.disabled': 'formState.disabled',
      },
    },
  ];

  toggleDisabled() {
    this.options.formState.disabled = !this.options.formState.disabled;
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
