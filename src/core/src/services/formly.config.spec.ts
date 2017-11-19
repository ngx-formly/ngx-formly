import { FormlyConfig } from './formly.config';
import { Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

describe('FormlyConfig service', () => {
  let config: FormlyConfig;
  beforeEach(() => {
    config = new FormlyConfig([{
      wrappers: [{ name: 'layout', component: TestComponent }],
      types: [{ name: 'input' }],
      validators: [{ name: 'required', validation: Validators.required }],
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
      ],
    }]);
  });

  describe('extra option: showError', () => {
    it('should return true when form is submitted and form is invalid', () => {
      const field = {},
        formControl = new FormControl(null, Validators.required),
        options = { parentForm: { submitted: true } };

      expect(config.extras.showError({ options, formControl, field } as any)).toBeTruthy();
    });
  });

  describe('wrappers', () => {
    it('should add wrapper', () => {
      config.setWrapper({ name: 'custom_wrapper', component: TestComponent });

      expect(config.getWrapper('layout').name).toEqual('layout');
      expect(config.getWrapper('custom_wrapper').name).toEqual('custom_wrapper');
    });

    it('should throw when wrapper not found', () => {
      const config = new FormlyConfig();
      expect(() => config.getWrapper('custom_wrapper')).toThrowError('[Formly Error] There is no wrapper by the name of "custom_wrapper"');
    });
  });

  describe('types', () => {
    it('should add type', () => {
      config.setType({ name: 'custom_input' });

      expect(config.getType('input').name).toEqual('input');
      expect(config.getType('custom_input').name).toEqual('custom_input');
    });

    it('should add type as an array', () => {
      config.setType([{ name: 'custom_input1' }, { name: 'custom_input2' }]);

      expect(config.getType('custom_input1').name).toEqual('custom_input1');
      expect(config.getType('custom_input2').name).toEqual('custom_input2');
    });

    it('should throw when type not found', () => {
      const config = new FormlyConfig();
      expect(() => config.getType('custom_input')).toThrowError('[Formly Error] There is no type by the name of "custom_input"');
    });

    it('should extends component + wrappers when not defined', () => {
      const config = new FormlyConfig();
      config.setType([
        { name: 'custom_input1', component: TestComponent, wrappers: ['label'] },
        { name: 'custom_input2', extends: 'custom_input1' },
      ]);

      expect(config.getType('custom_input2')).toEqual({
        name: 'custom_input2',
        component: TestComponent,
        wrappers: ['label'],
        extends: 'custom_input1',
        defaultOptions: undefined,
      });
    });
  });

  describe('validators', () => {
    it('should add validator', () => {
      config.setValidator({ name: 'null', validation: Validators.nullValidator });

      expect(config.getValidator('null').name).toEqual('null');
      expect(config.getValidator('required').name).toEqual('required');
    });

    it('should throw when validator not found', () => {
      const config = new FormlyConfig();
      expect(() => config.getValidator('custom_validator')).toThrowError('[Formly Error] There is no validator by the name of "custom_validator"');
    });
  });

  describe('message validation', () => {
    it('get validator error message', () => {
      expect(config.getValidatorMessage('required')).toEqual('This field is required.');
      expect(config.getValidatorMessage('maxlength')).toEqual(undefined);
    });

    it('add validator error message', () => {
      config.addValidatorMessage('maxlength', 'Maximum Length Exceeded.');
      expect(config.getValidatorMessage('maxlength')).toEqual('Maximum Length Exceeded.');
    });
  });
});

@Component({selector: 'formly-test-cmp', template: '', entryComponents: []})
class TestComponent {
}
