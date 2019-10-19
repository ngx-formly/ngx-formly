import { FormControl } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { FormlyFieldConfigCache } from '../../components/formly.field.config';
import { createBuilder } from '../../test-utils';

function buildField({ model, options, ...field }: FormlyFieldConfigCache): FormlyFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core', 'validation', 'form', 'expression'],
  });

  builder.buildField({
    model: model || {},
    options,
    fieldGroup: [field],
  });

  return field;
}

describe('FieldExpressionExtension', () => {
  describe('field visibility (hideExpression)', () => {
    it('should emit fieldChanges on change field visibility', () => {
      const fieldChanges = new Subject<any>();
      const spy = jasmine.createSpy('fieldChanges spy');
      const subscription = fieldChanges.subscribe(spy);

      const field = buildField({
        key: 'text',
        hideExpression: '!model.visibilityToggle',
        options: { fieldChanges },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ field, type: 'hidden', value: true });

      spy.calls.reset();
      field.model.visibilityToggle = 'test';
      field.options._checkField(field);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ field, type: 'hidden', value: false });

      subscription.unsubscribe();
    });

    it('should evaluate string expression and update field visibility', () => {
      const field = buildField({
        key: 'text',
        hideExpression: '!model.visibilityToggle',
      });

      expect(field.hide).toBeTruthy();
      expect(field.templateOptions.hidden).toBeTruthy();

      field.model.visibilityToggle = 'test';
      field.options._checkField(field);

      expect(field.hide).toBeFalsy();
      expect(field.templateOptions.hidden).toBeFalsy();
    });

    it('should evaluate function expression and update field visibility', () => {
      const field = buildField({
        key: 'text',
        hideExpression: () => true,
      });

      expect(field.hide).toBeTruthy();
    });

    it('should not override hide field within fieldGroup', () => {
      const field = buildField({
        hideExpression: () => false,
        fieldGroup: [
          {
            key: 'test',
            hide: true,
          },
        ],
      });

      expect(field.hide).toBeFalsy();
      expect(field.fieldGroup[0].hide).toBeTruthy();
    });

    it('should support multiple field with the same key', () => {
      const field = buildField({
          fieldGroup: [{
            key: 'key1',
            formControl: new FormControl(),
            hideExpression: model => model.type,
          },
          {
            key: 'key1',
            formControl: new FormControl(),
            hideExpression: model => !model.type,
          },
        ],
      });

      const { formControl: form, fieldGroup: [f1, f2]} = field;

      field.model.type = false;
      field.options._checkField(field);

      expect(f1.hide).toBeFalsy();
      expect(f1.formControl).toEqual(form.get('key1'));
      expect(f2.hide).toBeTruthy();
      expect(f2.formControl).not.toEqual(form.get('key1'));

      field.model.type = true;
      field.options._checkField(field);
      expect(f1.hide).toBeTruthy();
      expect(f1.formControl).not.toEqual(form.get('key1'));
      expect(f2.hide).toBeFalsy();
      expect(f2.formControl).toEqual(form.get('key1'));
    });
  });

  describe('expressionProperties', () => {
    it('should resolve a string expression', () => {
      const field = buildField({
        key: 'name',
        model: { label: 'test' },
        options: { formState: { className: 'name_test' } },
        expressionProperties: {
          className: 'formState.className',
          'templateOptions.key': 'field.key',
          'templateOptions.label': 'model.label',
        },
      });

      expect(field.className).toEqual('name_test');
      expect(field.templateOptions.key).toEqual('name');
      expect(field.templateOptions.label).toEqual('test');
    });

    it('should resolve a function expression', () => {
      const field = buildField({
        model: { label: 'test' },
        expressionProperties: {
          'templateOptions.label': () => 'test',
        },
      });

      expect(field.templateOptions.label).toEqual('test');
    });

    it('should resolve an observable expression', () => {
      const field = buildField({
        expressionProperties: {
          'templateOptions.label': of('test'),
        },
      });

      expect(field.templateOptions.label).toEqual('test');
    });

    it('should resolve a model expression', () => {
      const field = buildField({
        model: { label: 'test' },
        options: { formState: { className: 'name_test' } },
        key: 'name',
        expressionProperties: {
          'model.name': () => 'name_test',
          'model.custom': () => 'custom_test',
        },
      });

      expect(field.formControl.value).toEqual('name_test');
      expect(field.model.name).toEqual('name_test');
      expect(field.model.custom).toEqual('custom_test');
    });

    it('should update field validity when using built-in validations expression', () => {
      const formControl = new FormControl();
      spyOn(formControl, 'updateValueAndValidity');

      buildField({
        key: 'checked',
        formControl,
        expressionProperties: {
          'templateOptions.required': 'model.checked',
        },
        model: { checked: true },
      });

      expect(formControl.updateValueAndValidity).toHaveBeenCalledTimes(2);
    });

    describe('field disabled state', () => {
      it('should update field disabled state', () => {
        const field = buildField({
          key: 'text',
          expressionProperties: {
            'templateOptions.disabled': 'model.disableToggle',
          },
        });

        expect(field.templateOptions.disabled).toBeFalsy();

        field.model.disableToggle = 'test';
        field.options._checkField(field);

        expect(field.templateOptions.disabled).toBeTruthy();
      });

      it('should take account of parent disabled state', () => {
        const disabled = {
          address: true,
          city: false,
        };
        const field = buildField({
          key: 'address',
          expressionProperties: { 'templateOptions.disabled': () => disabled.address },
          fieldGroup: [
            {
              key: 'city',
              expressionProperties: { 'templateOptions.disabled': () => disabled.city },
            },
          ],
        });

        expect(field.templateOptions.disabled).toBeTruthy();
        expect(field.fieldGroup[0].templateOptions.disabled).toBeTruthy();

        disabled.address = false;
        field.options._checkField(field);

        expect(field.templateOptions.disabled).toBeFalsy();
        expect(field.fieldGroup[0].templateOptions.disabled).toBeFalsy();

        disabled.city = true;
        field.options._checkField(field);

        expect(field.templateOptions.disabled).toBeFalsy();
        expect(field.fieldGroup[0].templateOptions.disabled).toBeTruthy();
      });
    });
  });
});
