import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

export abstract class NzExampleBaseComponent {
  abstract model: any = {};
  abstract options: FormlyFormOptions = {};
  abstract fields: FormlyFieldConfig[];
  abstract fieldsTo: FormlyFieldConfig[];
  abstract mapFields: () =>  void;

  protected extendFields = () => {
    const fields = this.fields[0];
    const to = this.fieldsTo[0];

    Object.keys(fields.templateOptions).forEach(key => {
      to.templateOptions[key] = fields.templateOptions[key];
    });
  }
}
