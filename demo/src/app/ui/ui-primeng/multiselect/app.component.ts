import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  opts = new BehaviorSubject([
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
    { value: 4, label: 'Option 4', disabled: true },
  ]);
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'multiselect',
      type: 'multiselect',
      props: {
        label: 'Multiselect',
        required: true,
        showClear: true,
        options: this.opts,
      },
    },
  ];
}
