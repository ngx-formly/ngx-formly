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
      props: {
        text: 'With Function',
        onClick: () => alert('You clicked me!'),
      },
    },
    {
      type: 'button',
      props: {
        label: 'Click this guy',
        text: 'JSON Only',
        btnType: 'info',
        onClick: () => {
          this.form.get('someInput').setValue('clicked!');
        },
        description: 'These can have labels and stuff too if you want....',
      },
    },
    {
      key: 'someInput',
      type: 'input',
      props: {
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
