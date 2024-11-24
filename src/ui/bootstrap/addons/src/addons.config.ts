import { ConfigOption } from '@ngx-formly/core';
import { FormlyWrapperAddons } from './addons.component';
import { addonsExtension } from './addon.extension';

export function withFormlyWrapperAddons(): ConfigOption {
  return {
    wrappers: [{ name: 'addons', component: FormlyWrapperAddons }],
    extensions: [{ name: 'addons', extension: { postPopulate: addonsExtension } }],
  };
}
