
// import { Observable } from 'angular2/src/facade/async';
import {FormlyField} from "../components/formly.field";
export class FormlyFieldVisibilityDelegate {

    constructor(private formlyField:FormlyField) {
    }

    eval(expression:string | Function | boolean): boolean {
        //TODO support this.formlyField.field.hideExpression as a observable
        if (expression instanceof Function) {
            return expression();
        } else if(typeof expression === "string") {
            return new Function("return "+expression+";").call({model: this.formlyField.model});
        }
        else {
        //TODO support expression
            return expression ? true : false
        }
    }
    hasHideExpression() :boolean {
        return this.formlyField.field.hideExpression !== undefined && this.formlyField.field.hideExpression
    }

    checkVisibilityChange() {
        var hideExpressionResult: boolean = this.eval(this.formlyField.field.hideExpression);
        if (this.formlyField.field.hideExpression !== undefined && hideExpressionResult !== this.formlyField.isHidden())  {

            this.formlyField.setHidden(hideExpressionResult);
        }
    }
}