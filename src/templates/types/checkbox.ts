import {Component} from "@angular/core";
import {FormControl, AbstractControl} from "@angular/forms";
import {Field} from "./../field";
import {FormlyFieldConfig} from "../../components/formly.field.config";

@Component({
  selector: "formly-field-checkbox",
  template: `
    <label class="custom-control custom-checkbox">
      <input type="checkbox" [formControl]="formControl"
        *ngIf="!templateOptions.hidden" value="on"
        class="custom-control-input">
        {{templateOptions.label}}
        <span class="custom-control-indicator"></span>
    </label>
  `,
})
export class FormlyFieldCheckbox extends Field {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    return new FormControl({ value: model ? "on" : undefined, disabled: field.templateOptions.disabled }, field.validation);
  }
}
