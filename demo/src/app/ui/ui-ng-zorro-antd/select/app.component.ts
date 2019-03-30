import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NzExampleBaseComponent } from '../common/base';

const fields: FormlyFieldConfig[] = [
  {
    key: 'Select',
    type: 'select',
    templateOptions: {
      label: 'Select',
      nzPlaceHolder: 'Placeholder',
      description: 'Description',
      required: true,
      options: [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
        { value: 3, label: 'Option 3' },
        { value: 4, label: 'Option 4' },
      ],
    },
  },
];

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent extends NzExampleBaseComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = fields;
  fieldsTo: FormlyFieldConfig[] = JSON.parse(JSON.stringify(fields));

  mapFields = () => {
    this.extendFields();

    this.transformSeparatorToken();
  }

  private transformSeparatorToken(): void {
    const to = this.fieldsTo[0];
    const { nzTokenSeparators } = to.templateOptions;

    if (!!nzTokenSeparators) {
      to.templateOptions.nzTokenSeparators = [nzTokenSeparators];
    }
  }
}
