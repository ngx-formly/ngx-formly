import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'text',
      type: 'input',
      props: {
        label: 'Text',
        placeholder: 'Type here to see the other field become enabled...',
      },
    },
    {
      key: 'text2',
      type: 'input',
      props: {
        label: 'Hey!',
        placeholder: 'This one is disabled if there is no text in the other input',
      },
      expressions: {
        'props.disabled': '!model.text',
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
