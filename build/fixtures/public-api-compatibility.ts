import { FormlyAttributes, LegacyFormlyAttributes } from '@ngx-formly/core';
import { ɵIonFormlyAttributes } from '@ngx-formly/ionic/form-field';
import { FormlyFieldSelect } from '@ngx-formly/material/select';

declare const renderer: ConstructorParameters<typeof FormlyAttributes>[0];
declare const element: ConstructorParameters<typeof FormlyAttributes>[1];

new FormlyAttributes(renderer, element, { activeElement: null });
new LegacyFormlyAttributes(renderer, element, { activeElement: null });
new ɵIonFormlyAttributes(renderer, element, { activeElement: null });

declare const select: FormlyFieldSelect;
select.select = { _parentFormField: { _textField: null, getConnectedOverlayOrigin: () => element } };

declare const focus: Parameters<FormlyAttributes['onFocus']>[0];
focus.stopPropagation();
declare const blur: Parameters<FormlyAttributes['onBlur']>[0];
blur.stopPropagation();
declare const hostChange: Parameters<FormlyAttributes['onHostChange']>[0];
hostChange.stopPropagation();
declare const change: Parameters<FormlyAttributes['onChange']>[0];
change.stopPropagation();
