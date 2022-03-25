import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {
    tasks: [null],
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'tasks',
      type: 'repeat',
      props: {
        addText: 'Add Task',
        label: 'TODO LIST',
      },
      fieldArray: {
        type: 'input',
        props: {
          placeholder: 'Task name',
          required: true,
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
