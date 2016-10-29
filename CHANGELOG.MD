# 2.0.0-beta.10

### BREAKING CHANGES
* The service `FormlyMessages` is now renamed to `FormlyValidationMessages`.
   Before:

   ```ts
   import {FormlyMessages} from 'ng2-formly';
   ```
   After:

   ```ts
   import {FormlyValidationMessages} from 'ng2-formly';
   ```

* The component `FormlyMessage` is now renamed to `FormlyValidationMessage`.
   Before:

   ```html
   <formly-message [form]="form" [field]="field" [controlName]="key"></formly-message>
   ```
   After:

   ```html
   <formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>
   ```

# 2.0.0-beta.8

### Bug Fixes
* **#155**: allow changing fields input after init.
* **webpack**: add missing deps
* **#140**: assign default templateOptions.


### Features
* **ValidationMessages** Messages should have info of fields ([#177](https://github.com/formly-js/ng2-formly/issues/177)) [f285b63](https://github.com/formly-js/ng2-formly/commit/f285b63)
* **Validation** validation.show implementation ([#176](https://github.com/formly-js/ng2-formly/issues/176)) [80df918](https://github.com/formly-js/ng2-formly/commit/80df918)
* **Validation** Some basic validations in templateOptions [56a4097](https://github.com/formly-js/ng2-formly/commit/56a4097)
* **Validation**: add support for async-validation [c69fc74](https://github.com/formly-js/ng2-formly/commit/c69fc74)
* **Validation** add Validators API [eff65b9](https://github.com/formly-js/ng2-formly/commit/eff65b9)
* **Validation** Dynamic Validation Messages fixes #136 [600a80b](https://github.com/formly-js/ng2-formly/commit/600a80b)
* **Wrappers** Types property can be set to wrappers [fd2496c](https://github.com/formly-js/ng2-formly/commit/fd2496c)
* **Default Value** Add default Value functionility [43a643f](https://github.com/formly-js/ng2-formly/commit/43a643f)
* **TemplateOptions** Allow additional options fixes #152 [255b8e2](https://github.com/formly-js/ng2-formly/commit/255b8e2)
* **Lifecycle Hooks** Integrate the fields with lifecycle hooks [b4dcfaa](https://github.com/formly-js/ng2-formly/commit/b4dcfaa)
* **Nested Property**: support Nested Property Keys. [7f8064e](https://github.com/formly-js/ng2-formly/commit/7f8064e)
* **demo**: use webpack [db21952](https://github.com/formly-js/ng2-formly/commit/db21952)
* **fieldGroup**: use FormGroup for nested keys [398d5de](https://github.com/formly-js/ng2-formly/commit/398d5de)

### Style
* **tslint**: add more codelyzer rules. [8ac73e5](https://github.com/formly-js/ng2-formly/commit/8ac73e5)

### Build process
* **yarn** add yarn.lock file [9eb959d](https://github.com/formly-js/ng2-formly/commit/9eb959d)
* **travis**: use yarn [5092d3c](https://github.com/formly-js/ng2-formly/commit/5092d3c)
* **npm**: update packages + use peerDependencies. [4feed6d](https://github.com/formly-js/ng2-formly/commit/4feed6d)

### Refactor
* **FormlyField**: add field fieldGroupForm [320bdac](https://github.com/formly-js/ng2-formly/commit/320bdac)
* **Validation**: simplify init Field Validation. [0745f4a](https://github.com/formly-js/ng2-formly/commit/0745f4a)

### Documentation
* **bootstrap**: Update Documentation with bootstraping ng2-formly [09cd1b3](https://github.com/formly-js/ng2-formly/commit/09cd1b3)


### BREAKING CHANGES
* **Validation** Validation property in Validators property (#175) [706c2b6](https://github.com/formly-js/ng2-formly/commit/706c2b6)
Validations have been moved to Validators.validtion.

# Unreleased

### Bug Fixes
* Add missing form-control css class to select bootstrap template ([#82](https://github.com/formly-js/ng2-formly/issues/82))([pull request 85](https://github.com/formly-js/ng2-formly/pull/85))
* Update css classes for checkbox and radio to use bootstrap 4 custom inputs for better cross browser consistency([#82](https://github.com/formly-js/ng2-formly/issues/82))([pull request 85](https://github.com/formly-js/ng2-formly/pull/85))

### Features

* Add NgModules ([#80](https://github.com/formly-js/ng2-formly/issues/80)) ([pull request 86](https://github.com/formly-js/ng2-formly/pull/86))

### In-progress, not yet released

### BREAKING CHANGES
