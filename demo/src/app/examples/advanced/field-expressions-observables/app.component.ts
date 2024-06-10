import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
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
      key: 'interval',
      type: 'input',
      props: {
        label: 'This one is bound directly to an Observable and increments every second',
      },
      expressions: {
        'model.interval': interval(1000),
      },
    },
    {
      key: 'function',
      type: 'input',
      props: {
        label: 'This one is bound to a function that returns an Observable and increments every 2 seconds',
      },
      expressions: {
        'model.function$': function () {
          return interval(2000);
        },
      },
    },
    {
      key: 'function2',
      type: 'input',
      defaultValue: 1,
      props: {
        label: 'This one is bound to an arrow function that returns an Observable and multiplies by 2 every second',
      },
      expressions: {
        'model.function2$': (field) => {
          return interval(1000).pipe(map((_) => field.formControl.value * 2));
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
