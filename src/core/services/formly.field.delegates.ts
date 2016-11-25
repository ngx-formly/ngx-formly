import { evalExpression, expressionValueSetter } from './formly.expression';
import { FormlyField } from '../components/formly.field';

export class FormlyFieldVisibilityDelegate {
  constructor(private formlyCommon: FormlyField) {}

  hasHideExpression(): boolean {
    return (this.formlyCommon.field && this.formlyCommon.field.hideExpression !== undefined) && this.formlyCommon.field.hideExpression ? true : false;
  }

  checkVisibilityChange() {
    if (this.hasHideExpression()) {
      let hideExpressionResult: boolean = evalExpression(this.formlyCommon.field.hideExpression
        , this.formlyCommon, ['model', 'formState']
        , [this.formlyCommon.model, this.formlyCommon.options.formState]);

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
          let expressionValue = evalExpression(expressionProperties[key], this.formlyCommon, ['model', 'formState'], [this.formlyCommon.model, this.formlyCommon.options.formState]);

          // TODO Performance improvement for expression value Setter by caching built expression setter
          expressionValueSetter(key, expressionValue, this.formlyCommon
            , ['model', 'templateOptions', 'validation']
            , [this.formlyCommon.model, this.formlyCommon.field.templateOptions, this.formlyCommon.field.validation]);
        }

        const formControl = this.formlyCommon.form.get(this.formlyCommon.field.key),
          field = this.formlyCommon.field;
        if (formControl) {
            if (formControl.status === 'DISABLED' && !field.templateOptions.disabled) {
                formControl.enable();
            }
            if (formControl.status !== 'DISABLED' && field.templateOptions.disabled) {
                formControl.disable();
            }
            if (!formControl.dirty && formControl.invalid && field.validation && !field.validation.show) {
              formControl.markAsUntouched();
            }
            if (!formControl.dirty && formControl.invalid && field.validation && field.validation.show) {
              formControl.markAsTouched();
            }
        }
      }
    }
  }
}
