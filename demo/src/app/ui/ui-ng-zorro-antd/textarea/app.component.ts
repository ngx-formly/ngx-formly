import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NzExampleBaseComponent } from '../common/base';

const fields = [
  {
    key: 'Textarea',
    type: 'textarea',
    templateOptions: {
      label: 'Textarea',
      placeholder: 'Placeholder',
      description: 'Description',
      required: true,
    },
  },
];

export enum NzAutosizeValue {
  false,
  true,
  useObject,
}

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

    this.transformNzAutosize();
  }

  private transformNzAutosize() {
    const fields = this.fields[0];
    const to = this.fieldsTo[0];
    const { nzAutosize, nzAutosizeMaxRows = 0, nzAutosizeMinRows = 0 } = fields.templateOptions;

    if (nzAutosize !== NzAutosizeValue.useObject) {
      const options = to.templateOptions;
      options.nzAutosize = !!options.nzAutosize;
    } else {
      const options = to.templateOptions;

      options.nzAutosize = { maxRows: nzAutosizeMaxRows, minRows: nzAutosizeMinRows };
    }
  }
}
