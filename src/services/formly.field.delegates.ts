import {FormlyField} from "../components/formly.field";
import {evalExpression, expressionValueSetter} from "./formly.expression";

export class FormlyFieldVisibilityDelegate {

  constructor(private formlyField: FormlyField) {

  }

  eval(expression: string | Function | boolean): boolean {
    // TODO support this.formlyField.field.hideExpression as a observable
    if (expression instanceof Function) {
      return expression();
    } else if (typeof expression === "string") {
      return evalExpression(expression, this.formlyField, ["model", "fieldModel"], [this.formlyField.model, this.formlyField.model[this.formlyField.key]]);
    } else {
      return expression ? true : false;
    }
  }

  hasHideExpression(): boolean {
    return (this.formlyField.field.hideExpression !== undefined) && this.formlyField.field.hideExpression ? true : false;
  }
  checkVisibilityChange() {
    let hideExpressionResult: boolean = this.eval(this.formlyField.field.hideExpression);
    if (hideExpressionResult !== this.formlyField.isHidden()) {
      this.formlyField.setHidden(hideExpressionResult);
    }
  }
}

export class FormlyFieldExpressionDelegate {
  constructor(private formlyField: FormlyField) {

  }

  checkExpressionChange() {
    let expressionProperties = this.formlyField.field.expressionProperties;

    if (expressionProperties) {
      for (let key in expressionProperties) {
        let expressionValue = evalExpression(expressionProperties[key], this.formlyField, ["model", "fieldModel"], [this.formlyField.model, this.formlyField.model[this.formlyField.key]]);
        expressionValueSetter(key, expressionValue, this.formlyField
            , ["model", "fieldModel", "templateOptions"]
            , [this.formlyField.model, this.formlyField.model[this.formlyField.key], this.formlyField.field.templateOptions]);
      }
    }
  }
}
