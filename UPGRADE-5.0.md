UPGRADE FROM 4.0 to 5.0
=======================

@ngx-formly/core
----------------
**Note**: this only affect the user's who create a custom field type.

 * Custom field type `FieldType`: in case of creating a custom field that extend `FieldType`, calling `super.{ngOnInit, ngOnChanges, ngDoCheck, ngAfterViewInit, ngOnDestroy}` is not allowed anymore.

Before:
```ts
export class CustomFormlyField extends FieldType {
  ngOnInit() {
    super.ngOnInit();
    ...
  }
}
```

After:
```ts
export class CustomFormlyField extends FieldType {
  ngOnInit() {
    ...
  }
}
```

 * `FormlyValidationMessage`: the deprecated `fieldForm` input is removed

Before:
```html
<formly-validation-message [field]="field"  [fieldForm]="formcontrol"></formly-validation-message>
```
After:
```html
<formly-validation-message [field]="field"></formly-validation-message>
```

@ngx-formly/material
--------------------
**Note**: this only affect the user's who import sub-modules of `@ngx-formly/material` instead of main module `FormlyMaterialModule`.

 * `textarea`: textarea is moved into a new sub-module named `FormlyMatTextAreaModule` and is not part of `FormlyMatInputModule` anymore.

Before:
```ts
import { FormlyMatInputModule } from '@ngx-formly/material/input';
```
After:
```ts
import { FormlyMatInputModule } from '@ngx-formly/material/input';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
```

 * `multicheckbox`: multicheckbox is moved into a new sub-module named `FormlyMatMultiCheckboxModule` and is not part of `FormlyMatCheckboxModule` anymore.

Before:
```ts
import { FormlyMatCheckboxModule } from '@ngx-formly/material/checkbox';
```
After:
```ts
import { FormlyMatCheckboxModule } from '@ngx-formly/material/checkbox';
import { FormlyMatMultiCheckboxModule } from '@ngx-formly/material/multicheckbox';
```

@ngx-formly/bootstrap
---------------------

bootstrap v3 support is removed, so if you still using the v3 you may check the migrating to v4 https://getbootstrap.com/docs/4.0/migration/


@ngx-formly/ionic
-----------------

The library now require the Ionic V4 (https://blog.ionicframework.com/announcing-ionic-4-beta/).
