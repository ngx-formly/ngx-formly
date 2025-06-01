UPGRADE FROM 6.0 to 7.0
=======================
- Formly V7 now requires Angular Version >= 18

@ngx-formly/core
----------------
### 1. Support of standalone components:

This release add support of standalone components, for usage of standalone components please check the following example: https://stackblitz.com/edit/angular-wfy9zodl or our doc examples https://formly.dev/

* **Note**: No change is required for NgModule API (FormlyModule, FormlyBootstrapModule, ...) and it'll be still supported alongside with Standalone API.

| NgModule Api  | Standalone Alternative Api  |
|---|---|
| FormlyModule  | FormlyForm  | 
| FormlyModule.forRoot   |  provideFormlyCore  |
| FormlyModule.forChild | provideFormlyConfig |
| FormlyBootstrapModule | withFormlyBootstrap |
| FormlyMaterialModule | withFormlyMaterial |
| Formly{...UI}Module | withFormly{...UI} |


### 2. Remove deprecated `FormlyFormOptions` methods:
 
| Deprecated Method | Replaced with      |
| ----------------- | ------------------ |
| `_markForCheck`   | `detectChanges`    |
| `_buildForm`      | `build`            |
| `_markForCheck`   | `checkExpressions` |
