import { FormlyFormBuilder, FormlyConfig } from '../core';
import { ConfigOption, FormlyFieldConfigCache } from '../models';
import { FormGroup } from '@angular/forms';

function createBuilder(option?: ConfigOption) {
  const config = new FormlyConfig();
  config.addConfig(option || { extensions: [{ name: 'core', extension: {} }] });

  return new FormlyFormBuilder(config, null, null, null);
}

describe('FormlyFormBuilder service', () => {
  it('should throw error when core extension is not registred', () => {
    const builder = createBuilder({});

    const build = () => builder.build({});
    expect(build).toThrowError(/missing `forRoot\(\)` call/i);
  });

  it('should assign builder props to field options', () => {
    const builder = createBuilder();

    const field: FormlyFieldConfigCache = {};
    builder.build(field);

    expect(field.form).toEqual(expect.any(FormGroup));
    expect(field.options).toEqual(
      expect.objectContaining({
        _resolver: null,
        _injector: null,
        _buildForm: expect.any(Function),
        build: expect.any(Function),
      }),
    );

    global.console = { ...global.console, warn: jest.fn() };
    jest.spyOn(builder, 'build');
    field.options.build(field);
    field.options._buildForm();
    expect(console.warn).toBeCalled();
    expect(builder.build).toHaveBeenCalledTimes(2);
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
