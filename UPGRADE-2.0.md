UPGRADE FROM ng-formly to @ngx-formly/core
==========================================

Package name
------------

Before:
```ts
import {FormlyModule, FormlyBootstrapModule} from 'ng-formly';
```

After:
```ts
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
```

FormlyPubSub
------------

The `FormlyPubSub` service has been removed:

#### Before:
```ts
constructor(private fieldSubject: FormlyPubSub) {}
ngOnInit() {
  this.fieldSubject.getEmitter(this.key).subscribe(event => {
      // ....
  })
}
```

#### After:
```ts
constructor() {}
ngOnInit() {
  this.options.fieldChanges.subscribe(event => {
      // ....
  })
}
```

FormlyValidationMessages
------------------------

The `FormlyValidationMessages` service has been removed:

#### Before:
```ts
import { FormlyValidationMessages } from '@ngx-formly/core';
...
constructor(private formlyMessages: FormlyValidationMessages) {}
test(): string {
  this.formlyMessages.addStringMessage('required', 'This field is required.');
  this.formlyMessages.getValidatorErrorMessage('required');
}
```
#### After:
```ts
import { FormlyConfig } from '@ngx-formly/core';
...
constructor(private formlyConfig: FormlyConfig) {}
test(): string {
  this.formlyConfig.addValidatorMessage('required', 'This field is required.');
  this.formlyConfig.getValidatorMessage('required');
}
```

showError
---------

`valid` has been replaced by `showError`:

#### Before:
```html
<div *ngIf="!valid"></div>
```

#### After:
```html
<div *ngIf="showError"></div>
```
