import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldFormExtension } from './field-form';
import { FormlyFieldConfig } from '../../components/formly.field.config';

function createField(field: FormlyFieldConfig): FormlyFieldConfig {
  const f = { modelOptions: {}, templateOptions: {}, ...field };
  f.parent = { formControl: new FormGroup({}), fieldGroup: [f] };

  return f;
}

describe('FieldFormExtension', () => {
  let extension: FieldFormExtension;
  beforeEach(() => {
    extension = new FieldFormExtension();
  });

  describe('field', () => {
    it('should create formControl when key exist', () => {
      const field = createField({ key: 'title' });

      extension.onPopulate(field);
      expect(field.formControl instanceof FormControl).toBeTruthy();
    });

    xit('should not create formControl when key is empty', () => {
      const field = createField({});

      extension.onPopulate(field);
      expect(field.formControl).toBeUndefined();
    });
  });

  describe('fieldGroup', () => {
    it('should assign parent formcontrol when key is empty', () => {
      const field = createField({ fieldGroup: [] });

      extension.onPopulate(field);
      expect(field.formControl).toEqual(field.parent.formControl);
    });
  });

  it('should override existing formcontrol when key is empty', () => {
    const field = createField({
      fieldGroup: [],
      formControl: new FormControl(),
    });

    extension.onPopulate(field);
    expect(field.formControl).toEqual(field.parent.formControl);
  });


  it('should add formControl for field with empty key', () => {
    const field = createField({ defaultValue: 5 });

    extension.onPopulate(field);
    expect(field.formControl).toBeDefined();
    expect(field.formControl.value).toEqual(5);

    field['_validators'] = [Validators.min(10)];
    extension.postPopulate(field.parent);

    expect(field.formControl.validator).not.toBeNull();
  });
});
