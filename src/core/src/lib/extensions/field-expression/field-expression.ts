import { FormlyFieldConfig, FormlyValueChangeEvent, FormlyFieldConfigCache } from '../../models';
import { isObject, isNil, isFunction, defineHiddenProp, observe } from '../../utils';
import { evalExpression, evalStringExpression, evalExpressionValueSetter } from './utils';
import { Observable } from 'rxjs';
import { FormlyExtension } from '../../models';
import { unregisterControl, registerControl } from '../field-form/utils';

/** @experimental */
export class FieldExpressionExtension implements FormlyExtension {
  onPopulate(field: FormlyFieldConfigCache) {
    if (field._expressions) {
      return;
    }

    // cache built expression
    defineHiddenProp(field, '_expressions', {});
    field.expressionProperties = field.expressionProperties || {};

    observe(field, ['hide'], ({ currentValue, firstChange }) => {
      if (!firstChange || (firstChange && currentValue === true)) {
        field.templateOptions.hidden = currentValue;
        field.options._hiddenFieldsForCheck.push(field);
      }
    });

    if (field.hideExpression) {
      observe(field, ['hideExpression'], ({ currentValue: expr }) => {
        field._expressions.hide = this.parseExpressions(field, 'hide', typeof expr === 'boolean' ? () => expr : expr);
      });
    }

    for (const key of Object.keys(field.expressionProperties)) {
      observe(field, ['expressionProperties', key], ({ currentValue: expr }) => {
        if (typeof expr === 'string' || isFunction(expr)) {
          field._expressions[key] = this.parseExpressions(field, key, expr);
        } else if (expr instanceof Observable) {
          const subscription = (expr as Observable<any>).subscribe(v =>
            evalExpression(
              evalExpressionValueSetter(`field.${key}`, ['expressionValue', 'model', 'field']),
              { field },
              [v, field.model, field],
            ),
          );

          const onDestroy = field.hooks.onDestroy;
          field.hooks.onDestroy = field => {
            onDestroy && onDestroy(field);
            subscription.unsubscribe();
          };
        }
      });
    }
  }

  postPopulate(field: FormlyFieldConfigCache) {
    if (field.parent) {
      return;
    }

    if (!field.options._checkField) {
      field.options._checkField = this.checkExpressions.bind(this);
    }

    field.options._checkField(field, true);
  }

  private parseExpressions(field: FormlyFieldConfigCache, path: string, expr: any) {
    let parentExpression: any;
    if (field.parent && ['hide', 'templateOptions.disabled'].includes(path)) {
      parentExpression = evalStringExpression(`!!field.parent.${path}`, ['field']);
    }

    expr = expr || (() => false);
    if (typeof expr === 'string') {
      expr = evalStringExpression(expr, ['model', 'formState', 'field']);
    }

    let currentValue: any;
    const valueSetter = evalExpressionValueSetter(`field.${path}`, ['expressionValue', 'model', 'field']);
    const evalExpr = (value: any) => {
      currentValue = value;
      evalExpression(valueSetter, { field }, [value, field.model, field]);
      if (path === 'templateOptions.disabled' && field.key) {
        this.changeDisabledState(field, value);
      }

      if (path.indexOf('model.') === 0) {
        const key = path.replace(/^model\./, ''),
          control = field.key && field.key === key ? field.formControl : field.form.get(key);

        if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
          control.patchValue(value);
        }
      }
    };

    return (ignoreCache?: boolean) => {
      const exprValue = evalExpression(
        parentExpression ? (...args) => parentExpression(field) || expr(...args) : expr,
        { field },
        [field.model, field.options.formState, field],
      );

      if (
        ignoreCache ||
        (currentValue !== exprValue &&
          (!isObject(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue)))
      ) {
        evalExpr(exprValue);

        return true;
      }

      return false;
    };
  }

  private checkExpressions(field: FormlyFieldConfigCache, ignoreCache = false) {
    let markForCheck = false;
    if (field._expressions) {
      for (const key of Object.keys(field._expressions)) {
        field._expressions[key](ignoreCache) && (markForCheck = true);
      }
    }

    if (field.fieldGroup) {
      field.fieldGroup.forEach(f => this.checkExpressions(f, ignoreCache));
    }

    if (markForCheck && field.options && field.options._markForCheck) {
      field.options._markForCheck(field);
    }

    if (!field.parent) {
      const options = field.options;
      options._hiddenFieldsForCheck.sort(f => (f.hide ? -1 : 1)).forEach(f => this.changeHideState(f, f.hide));
      options._hiddenFieldsForCheck = [];
    }
  }

  private changeDisabledState(field: FormlyFieldConfig, value: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup
        .filter(f => !f.expressionProperties || !f.expressionProperties.hasOwnProperty('templateOptions.disabled'))
        .forEach(f => this.changeDisabledState(f, value));
    }

    if (field.key && field.templateOptions.disabled !== value) {
      field.templateOptions.disabled = value;
    }
  }

  private changeHideState(field: FormlyFieldConfig, hide: boolean) {
    if (field.fieldGroup) {
      field.fieldGroup.filter(f => !f.hideExpression).forEach(f => this.changeHideState(f, hide));
    }

    if (field.formControl && field.key) {
      hide === true ? unregisterControl(field) : registerControl(field);
    }

    if (field.options.fieldChanges) {
      field.options.fieldChanges.next(<FormlyValueChangeEvent>{ field, type: 'hidden', value: hide });
    }
  }
}
