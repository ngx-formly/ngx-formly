import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyDatepickerFieldConfig } from '@ngx-formly/optimus-ui/datepicker';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields: FormlyDatepickerFieldConfig[] = [
    {
      key: 'travelDates',
      type: 'datepicker',
      props: {
        label: 'Travel dates',
        placeholder: 'Choose a date range',
        dateFormat: 'yy/mm/dd',
        selectionMode: 'range',
        required: true,
      },
    },
    {
      key: 'departure',
      type: 'datepicker',
      props: {
        label: 'Departure time',
        hourFormat: '24',
        showTime: true,
        showButtonBar: true,
        stepMinute: 15,
        showClear: true,
        appendTo: 'body',
      },
    },
  ];
}
