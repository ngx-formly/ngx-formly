import { FormGroup } from '@angular/forms';
import { FormlyConfig, FormlyFormBuilder } from '../core';
import { ConfigOption, FormlyFieldConfigCache } from '../models';
import { createBuilder as createFormlyBuilder } from '@ngx-formly/core/testing';
import { of } from 'rxjs';

function createBuilder(option?: ConfigOption) {
  const config = new FormlyConfig();
  config.addConfig(option || { extensions: [{ name: 'core', extension: {} }] });

  return new FormlyFormBuilder(config, null, null, null);
}

describe('FormlyFormBuilder service', () => {
  it.each(['filled', undefined])('should emit one initial status for model value %p', (value) => {
    const builder = createFormlyBuilder();
    const form = new FormGroup({});
    const status = jest.fn();
    const valueChanged = jest.fn();
    form.statusChanges.subscribe(status);
    form.valueChanges.subscribe(valueChanged);
    const field: FormlyFieldConfigCache = {
      form,
      model: { name: value },
      fieldGroup: [{ key: 'name', props: { required: true } }],
    };

    builder.build(field);
    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(value === undefined ? 'INVALID' : 'VALID');
    expect(valueChanged).toHaveBeenCalledTimes(1);
    expect(valueChanged).toHaveBeenCalledWith({ name: value });

    status.mockClear();
    builder.build(field);
    expect(status).not.toHaveBeenCalled();
  });

  it('should notify initial status without restarting async validation', () => {
    const builder = createFormlyBuilder();
    const form = new FormGroup({});
    const status = jest.fn();
    const validate = jest.fn(() => of(null));
    form.statusChanges.subscribe(status);

    builder.build({ form, fieldGroup: [], asyncValidators: { validation: [validate] } });
    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith('VALID');
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('should retry initial status notification after a failed build', () => {
    let fail = true;
    const builder = createBuilder({
      extensions: [
        {
          name: 'core',
          extension: {
            onPopulate: () => {
              if (fail) {
                throw new Error('Failed build');
              }
            },
          },
        },
      ],
    });
    const form = new FormGroup({});
    const status = jest.fn();
    form.statusChanges.subscribe(status);
    const field: FormlyFieldConfigCache = { form };

    expect(() => builder.build(field)).toThrow('Failed build');
    expect(status).not.toHaveBeenCalled();
    fail = false;
    builder.build(field);
    expect(status).toHaveBeenCalledWith('VALID');
  });

  it('should throw error when core extension is not registred', () => {
    const builder = createBuilder({});

    const build = () => builder.build({});
    expect(build).toThrow(/missing `forRoot\(\)` call/i);
  });

  it('should assign builder props to field options', () => {
    const builder = createBuilder();

    const field: FormlyFieldConfigCache = {};
    builder.build(field);

    expect(field.form).toEqual(expect.any(FormGroup));
    expect(field.options).toEqual(
      expect.objectContaining({
        _viewContainerRef: null,
        _injector: null,
        build: expect.any(Function),
      }),
    );

    global.console = { ...global.console, warn: jest.fn() };
    jest.spyOn(builder, 'build');
    field.options.build(field);
    expect(builder.build).toHaveBeenCalledTimes(1);
  });

  it('should call extension during build call', () => {
    const spy = jest.fn();
    const extension = {
      prePopulate: () => spy('prePopulate'),
      onPopulate: () => spy('onPopulate'),
      postPopulate: () => spy('postPopulate'),
    };

    const builder = createBuilder({
      extensions: [{ name: 'core', extension }],
    });

    builder.build({});

    expect(spy.mock.calls).toEqual([['prePopulate'], ['onPopulate'], ['postPopulate']]);
  });

  it('should call extensions in default order during build call', () => {
    const spy = jest.fn();
    const core = {
      prePopulate: () => spy('prePopulateCore'),
      onPopulate: () => spy('onPopulateCore'),
      postPopulate: () => spy('postPopulateCore'),
    };
    const extension1 = {
      prePopulate: () => spy('prePopulate1'),
      onPopulate: () => spy('onPopulate1'),
      postPopulate: () => spy('postPopulate1'),
    };
    const extension2 = {
      prePopulate: () => spy('prePopulate2'),
      onPopulate: () => spy('onPopulate2'),
      postPopulate: () => spy('postPopulate2'),
    };

    const builder = createBuilder({
      extensions: [
        { name: 'core', extension: core, priority: -1 },
        { name: 'extension1', extension: extension1 },
        { name: 'extension2', extension: extension2 },
      ],
    });

    builder.build({});

    expect(spy.mock.calls).toEqual([
      ['prePopulateCore'],
      ['prePopulate1'],
      ['prePopulate2'],
      ['onPopulateCore'],
      ['onPopulate1'],
      ['onPopulate2'],
      ['postPopulateCore'],
      ['postPopulate1'],
      ['postPopulate2'],
    ]);
  });

  it('should call extensions in modified order during build call', () => {
    const spy = jest.fn();
    const core = {
      prePopulate: () => spy('prePopulateCore'),
      onPopulate: () => spy('onPopulateCore'),
      postPopulate: () => spy('postPopulateCore'),
    };
    const extension1 = {
      prePopulate: () => spy('prePopulate1'),
      onPopulate: () => spy('onPopulate1'),
      postPopulate: () => spy('postPopulate1'),
    };
    const extension2 = {
      prePopulate: () => spy('prePopulate2'),
      onPopulate: () => spy('onPopulate2'),
      postPopulate: () => spy('postPopulate2'),
    };

    const builder = createBuilder({
      extensions: [
        { name: 'core', extension: core, priority: -1 },
        { name: 'extension1', extension: extension1, priority: 10 },
        { name: 'extension2', extension: extension2 },
      ],
    });

    builder.build({});

    expect(spy.mock.calls).toEqual([
      ['prePopulateCore'],
      ['prePopulate2'],
      ['prePopulate1'],
      ['onPopulateCore'],
      ['onPopulate2'],
      ['onPopulate1'],
      ['postPopulateCore'],
      ['postPopulate2'],
      ['postPopulate1'],
    ]);
  });

  it('should build nested field', () => {
    const extension = { onPopulate: () => {} };
    jest.spyOn(extension, 'onPopulate');

    const builder = createBuilder({
      extensions: [{ name: 'core', extension }],
    });

    builder.build({ fieldGroup: [{ key: 'child' }] });
    expect(extension.onPopulate).toHaveBeenCalledTimes(2);
  });
});
