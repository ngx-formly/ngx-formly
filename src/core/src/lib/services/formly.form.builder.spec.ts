import { FormlyFormBuilder, FormlyConfig } from '../core';
import { FormlyFieldConfigCache } from '../components/formly.field.config';
import { ConfigOption } from './formly.config';
import { FormGroup } from '@angular/forms';

function createBuilder(option?: ConfigOption) {
  const config = new FormlyConfig();
  config.addConfig(option || { extensions: [{ name: 'core', extension: {} }] });

  return new FormlyFormBuilder(config, null, null, null);
}

describe('FormlyFormBuilder service', () => {
  it('should throw error when core extension is not registred', () => {
    const builder = createBuilder({});

    const buildField = () => builder.buildField({});
    expect(buildField).toThrowError(/missing `forRoot\(\)` call/i);
  });

  it('should assign builder props to field options', () => {
    const builder = createBuilder();

    const field: FormlyFieldConfigCache = {};
    builder.buildField(field);

    expect(field.formControl).toEqual(jasmine.any(FormGroup));
    expect(field.options).toEqual(
      jasmine.objectContaining({
        _resolver: null,
        _injector: null,
        _buildForm: jasmine.any(Function),
        _buildField: jasmine.any(Function),
      }),
    );

    spyOn(builder, 'buildField');
    field.options._buildField(field);
    field.options._buildForm();
    expect(builder.buildField).toHaveBeenCalledTimes(2);
  });

  it('should call extension during build call', () => {
    const extension = {
      prePopulate: () => {},
      onPopulate: () => {},
      postPopulate: () => {},
    };
    spyOn(extension, 'prePopulate');
    spyOn(extension, 'onPopulate');
    spyOn(extension, 'postPopulate');

    const builder = createBuilder({
      extensions: [{ name: 'core', extension }],
    });

    builder.buildField({});

    expect(extension.prePopulate).toHaveBeenCalledBefore(extension.onPopulate);
    expect(extension.onPopulate).toHaveBeenCalledBefore(extension.postPopulate);
    expect(extension.postPopulate).toHaveBeenCalled();
    expect(extension.onPopulate).toHaveBeenCalledTimes(1);
  });

  it('should build nested field', () => {
    const extension = { onPopulate: () => {} };
    spyOn(extension, 'onPopulate');

    const builder = createBuilder({
      extensions: [{ name: 'core', extension }],
    });

    builder.buildField({ fieldGroup: [{ key: 'child' }] });
    expect(extension.onPopulate).toHaveBeenCalledTimes(2);
  });
});
