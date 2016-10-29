import { evalExpression, expressionValueSetter } from './formly.expression';
import { FormlyField } from '../components/formly.field';

export class FormlyFieldVisibilityDelegate {
  constructor(private formlyCommon: FormlyField) {}

  eval(expression: string | Function | boolean): boolean {
    // TODO support this.formlyCommon.field.hideExpression as a observable
    if (expression instanceof Function) {
      return expression();
    } else if (typeof expression === 'string') {
      return evalExpression(expression, this.formlyCommon, ['model', 'fieldModel'], [this.formlyCommon.formModel, this.formlyCommon.model]);
    } else {
      return expression ? true : false;
    }
  }

  hasHideExpression(): boolean {
    return (this.formlyCommon.field && this.formlyCommon.field.hideExpression !== undefined) && this.formlyCommon.field.hideExpression ? true : false;
  }

  checkVisibilityChange() {
    if (this.hasHideExpression()) {
      let hideExpressionResult: boolean = this.eval(this.formlyCommon.field.hideExpression);
      if (hideExpressionResult !== this.formlyCommon.hide) {
        this.formlyCommon.hide = hideExpressionResult;
      }
    }
  }
}

export class FormlyFieldExpressionDelegate {
  constructor(private formlyCommon: FormlyField) {}

  hasExpression(): boolean {
    return (this.formlyCommon.field && this.formlyCommon.field.expressionProperties !== undefined);
  }

  checkExpressionChange() {
    if (this.hasExpression()) {
      let expressionProperties = this.formlyCommon.field.expressionProperties;

      if (expressionProperties) {
        for (let key in expressionProperties) {
          // TODO Performance improvement for expression Evaluation by caching built expression
          let expressionValue = evalExpression(expressionProperties[key], this.formlyCommon, ['model', 'fieldValue'], [this.formlyCommon.formModel, this.formlyCommon.model]);

          // TODO Performance improvement for expression value Setter by caching built expression setter
          expressionValueSetter(key, expressionValue, this.formlyCommon
            , ['model', 'fieldModel', 'templateOptions', 'validation']
            , [this.formlyCommon.formModel, this.formlyCommon.model, this.formlyCommon.field.templateOptions, this.formlyCommon.field.validation]);
        }

        // disable attribute binding is not supported (see https://github.com/angular/angular/issues/11324)
        let formControl = this.formlyCommon.form.get(this.formlyCommon.field.key);
        if (formControl) {
            if (formControl.status === 'DISABLED' && !this.formlyCommon.field.templateOptions.disabled) {
                formControl.enable();
            }
            if (formControl.status !== 'DISABLED' && this.formlyCommon.field.templateOptions.disabled) {
                formControl.disable();
            }
            if (!formControl.dirty && formControl.invalid && this.formlyCommon.field.validation && !this.formlyCommon.field.validation.show) {
              formControl.markAsUntouched();
            }
            if (!formControl.dirty && formControl.invalid && this.formlyCommon.field.validation && this.formlyCommon.field.validation.show) {
              formControl.markAsTouched();
            }
        }
      }
    }
  }
}
