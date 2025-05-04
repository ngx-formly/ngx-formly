UPGRADE FROM 6.0 to 7.0
=======================
- Formly V7 now requires Angular Version >= 18

@ngx-formly/core
----------------
### 1. Remove deprecated `FormlyFormOptions` methods:
 
| Deprecated Method | Replaced with      |
| ----------------- | ------------------ |
| `_markForCheck`   | `detectChanges`    |
| `_buildForm`      | `build`            |
| `_markForCheck`   | `checkExpressions` |
