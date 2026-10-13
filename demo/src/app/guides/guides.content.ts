import gettingStartedMd from '../../../../docs/getting-started.md?raw' with { loader: 'text' };
import propertiesOptionsMd from '../../../../docs/properties-options.md?raw' with { loader: 'text' };
import customFormlyFieldMd from '../../../../docs/custom-formly-field.md?raw' with { loader: 'text' };
import customFormlyExtensionMd from '../../../../docs/custom-formly-extension.md?raw' with { loader: 'text' };
import customFormlyWrapperMd from '../../../../docs/custom-formly-wrapper.md?raw' with { loader: 'text' };
import validationMd from '../../../../docs/validation.md?raw' with { loader: 'text' };
import expressionPropertiesMd from '../../../../docs/expression-properties.md?raw' with { loader: 'text' };
import formlyFieldPresetsMd from '../../../../docs/formly-field-presets.md?raw' with { loader: 'text' };
import jsonSchemaMd from '../../../../docs/json-schema.md?raw' with { loader: 'text' };
import faqMd from '../../../../docs/faq.md?raw' with { loader: 'text' };
import migrationV10Md from '../../../../UPGRADE-10.0.md?raw' with { loader: 'text' };
import migrationV9Md from '../../../../UPGRADE-9.0.md?raw' with { loader: 'text' };
import migrationV8Md from '../../../../UPGRADE-8.0.md?raw' with { loader: 'text' };
import migrationV7Md from '../../../../UPGRADE-7.0.md?raw' with { loader: 'text' };
import migrationV6Md from '../../../../UPGRADE-6.0.md?raw' with { loader: 'text' };
import migrationV5Md from '../../../../UPGRADE-5.0.md?raw' with { loader: 'text' };
import migrationV2Md from '../../../../UPGRADE-2.0.md?raw' with { loader: 'text' };

export const GUIDE_CONTENTS: Record<string, string> = {
  'getting-started': gettingStartedMd,
  'properties-options': propertiesOptionsMd,
  'custom-formly-field': customFormlyFieldMd,
  'custom-formly-extension': customFormlyExtensionMd,
  'custom-formly-wrapper': customFormlyWrapperMd,
  validation: validationMd,
  'expression-properties': expressionPropertiesMd,
  'formly-field-presets': formlyFieldPresetsMd,
  'json-schema': jsonSchemaMd,
  faq: faqMd,
  v10: migrationV10Md,
  v9: migrationV9Md,
  v8: migrationV8Md,
  v7: migrationV7Md,
  v6: migrationV6Md,
  v5: migrationV5Md,
  v2: migrationV2Md,
};
