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
      key: 'name',
      type: 'input',
      props: {
        label: 'Name',
        placeholder: 'Type in here to display the hidden field',
      },
    },
    {
      key: 'iLikeTwix',
      type: 'checkbox',
      props: {
        label: 'I like twix',
      },
      expressions: {
        hide: '!model.name',
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
