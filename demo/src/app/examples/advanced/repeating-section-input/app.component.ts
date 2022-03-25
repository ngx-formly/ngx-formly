import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {
    investmentsCount: 3,
    investments: [],
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'investmentsCount',
      type: 'input',
      defaultValue: 3,
      props: {
        type: 'number',
        label: 'Investments count',
        required: true,
        min: 1,
      },
      hooks: {
        onInit: (field) => {
          return field.formControl.valueChanges.pipe(
            startWith(field.formControl.value),
            filter((v) => v > 0),
            tap((value) => {
              if (this.model.investments.length !== value) {
                this.model.investments.length = value;
                this.model = { ...this.model, investmentsCount: value };
              }
            }),
          );
        },
      },
    },
    {
      key: 'investments',
      type: 'repeat',
      fieldArray: {
        type: 'input',
        key: 'investmentName',
        props: {
          label: 'Name of Investment:',
          required: true,
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}
