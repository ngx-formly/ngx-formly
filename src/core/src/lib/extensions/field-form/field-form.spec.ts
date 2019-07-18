import { FormControl, FormGroup } from '@angular/forms';
import { FieldFormExtension } from './field-form';
import { FormlyFieldConfig } from '../../components/formly.field.config';

describe('FieldFormExtension', () => {
  let extension: FieldFormExtension;
  beforeEach(() => {
    extension = new FieldFormExtension();
  });

  describe('fieldGroup', () => {
    it('should assign parent formcontrol when key is empty', () => {
      const field: FormlyFieldConfig = {
        fieldGroup: [],
        parent: { formControl: new FormGroup({}) },
      };

      extension.onPopulate(field);
      expect(field.formControl).toEqual(field.parent.formControl);
    });
  });

  it('should override existing formcontrol when key is empty', () => {
    const field: FormlyFieldConfig = {
      fieldGroup: [],
      formControl: new FormControl(),
      parent: { formControl: new FormGroup({}) },
    };

    extension.onPopulate(field);
    expect(field.formControl).toEqual(field.parent.formControl);
  });
});
