export { provideFormlyCore, provideFormlyConfig, FORMLY_CONFIG } from './core.config';
export { LegacyFormlyForm, FormlyForm } from './components/formly.form';
export {
  FormlyFieldConfig,
  FormlyTemplateOptions,
  FormlyFormOptions,
  FormlyFieldProps,
  ConfigOption,
  FormlyExtension,
} from './models';
export { LegacyFormlyField, FormlyField } from './components/formly.field';
export { LegacyFormlyAttributes, FormlyAttributes } from './templates/formly.attributes';
export { FormlyGroup as ɵFormlyGroup } from './templates/formly.group';
export { FormlyTemplate, LegacyFormlyTemplate as ɵFormlyTemplate } from './components/formly.template';
export { LegacyFormlyValidationMessage, FormlyValidationMessage } from './templates/formly.validation-message';
export { FormlyConfig } from './services/formly.config';
export { FormlyFormBuilder } from './services/formly.builder';
export { FieldType, FieldTypeConfig, FieldGroupTypeConfig } from './templates/field.type';
export { FieldArrayType, FieldArrayTypeConfig } from './templates/field-array.type';
export { FieldWrapper } from './templates/field.wrapper';
export { FormlyModule } from './core.module';
export { defineHiddenProp as ɵdefineHiddenProp } from './utils';
export { reverseDeepMerge as ɵreverseDeepMerge } from './utils';
export { getFieldValue as ɵgetFieldValue } from './utils';
export { clone as ɵclone } from './utils';
export { observe as ɵobserve } from './utils';
export { hasKey as ɵhasKey } from './utils';
