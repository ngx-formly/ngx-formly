import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = { someInput: '' };

  fields: FormlyFieldConfig[] = [
    {
      type: 'button',
      templateOptions: {
        text: 'With Function',
        onClick: ($event) => alert('You clicked me!'),
      },
    },
    {
      type: 'button',
      templateOptions: {
        label: 'Click this guy',
        text: 'JSON Only',
        btnType: 'info',
        onClick: ($event) => {
          this.form.get('someInput').setValue('clicked!');
        },
        description: 'These can have labels and stuff too if you want....',
      },
    },
    {
      key: 'someInput',
      type: 'input',
      templateOptions: {
        label: 'Some Input',
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
