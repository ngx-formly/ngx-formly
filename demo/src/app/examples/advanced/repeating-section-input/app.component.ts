import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  onDestroy$ = new Subject<void>();
  form = new FormGroup({});
  model = {
    investmentsCount: 3,
    investments: [],
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'investmentsCount',
      type: 'input',
      defaultValue: 3,
      templateOptions: {
        type: 'number',
        label: 'Investments count',
        required: true,
      },
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.pipe(
            takeUntil(this.onDestroy$),
            startWith(field.formControl.value),
            filter(v => v > 0),
            tap(value => {
              this.model.investments.length = value;
              this.model = {
                ...this.model,
                investmentsCount: value,
              };
            }),
          ).subscribe();
        },
      },
    },
    {
      key: 'investments',
      type: 'repeat',
      fieldArray: {
        type: 'input',
        key: 'investmentName',
        templateOptions: {
          label: 'Name of Investment:',
          required: true,
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
