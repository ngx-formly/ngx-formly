import { Component } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { FormlySelectFieldConfig } from '@ngx-formly/material/select';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new UntypedFormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields: FormlySelectFieldConfig[] = [
    {
      key: 'country',
      type: 'select',
      defaultValue: { code: 'CH' },
      props: {
        label: 'Country',
        triggerLabel: 'code',
        compareWith: (a, b) => a?.code === b?.code,
        options: [
          { label: 'Switzerland', value: { code: 'CH' } },
          { label: 'France', value: { code: 'FR' } },
        ],
      },
    },
    {
      key: 'weeks',
      type: 'select',
      defaultValue: [1, 2],
      props: {
        label: 'Weeks',
        placeholder: 'Choose weeks',
        multiple: true,
        selectAllOption: 'Select All',
        triggerLabel: (weeks: number[]) => `Weeks: ${weeks.join(', ')}`,
        options: [
          { label: 'Week 1', value: 1 },
          { label: 'Week 2', value: 2 },
          { label: 'Week 3', value: 3 },
        ],
      },
    },
  ];
}
