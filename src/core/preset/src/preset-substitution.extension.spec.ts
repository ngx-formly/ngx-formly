import { createFieldComponent, FormlyInputModule } from '@ngx-formly/core/testing';
import { FormlyConfig, FormlyFieldConfig, FORMLY_CONFIG } from '@ngx-formly/core';
import { registerLibraryConfigReplacementExtension } from './preset-substitution.extension';

function renderComponent(field: FormlyFieldConfig) {
  return createFieldComponent(field, {
    imports: [FormlyInputModule],
    config: {
      presets: [
        { name: 'test', config: { key: 'test', type: 'input', props: { label: 'testlabel' } } },
        {
          name: 'test2',
          config: { getConfiguration: () => ({ key: 'test2', type: 'input' }) },
        },
      ],
    },
    providers: [
      {
        provide: FORMLY_CONFIG,
        useFactory: registerLibraryConfigReplacementExtension,
        deps: [FormlyConfig],
        multi: true,
      },
    ],
  });
}

describe('Preset Substitution Extension', () => {
  it('should subsitute pseudo-typed field with configured preset', () => {
    const config = { type: '#test' };
    const { field } = renderComponent(config);

    expect(field.key).toEqual('test');
    expect(field.type).toEqual('input');
  });

  it('should throw error when using pseudo-type with no corresponding preset', () => {
    const config = { type: '#blub' };

    expect(() => renderComponent(config)).toThrow();
  });

  it('should correctly merge additional properties', () => {
    const config = { type: '#test', props: { label: 'xyz' } };
    const { field } = renderComponent(config);

    expect(field.key).toEqual('test');
    expect(field.props.label).toEqual('xyz');
  });

  it('should correctly merge and override properties', () => {
    const config = { type: '#test', key: 'newkey', props: { label: 'xyz' } };
    const { field } = renderComponent(config);

    expect(field.key).toEqual('newkey');
    expect(field.props.label).toEqual('xyz');
  });

  it('should correctly extract configuration from a FormlyFieldConfigPresetProvider', () => {
    const config = { type: '#test2' };
    const { field } = renderComponent(config);

    expect(field.key).toEqual('test2');
    expect(field.type).toEqual('input');
  });
});
