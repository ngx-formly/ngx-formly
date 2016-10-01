
import {Component} from "@angular/core";
import {FormGroup, FormControl, AbstractControl} from "@angular/forms";
import {Field} from "./field";
import {FormlyFieldConfig} from "../components/formly.field.config";

@Component({
  selector: "formly-field-multicheckbox",
  template: `
        <div [formGroup]="form">
            <div [formGroupName]="key" class="form-group">
                <label class="form-control-label" for="">{{templateOptions.label}}</label>
                <div *ngFor="let option of templateOptions.options" class="checkbox">
                    <label class="custom-control custom-checkbox">
                        <input type="checkbox" name="choose" value="{{option.value}}" [formControlName]="option.key"
                        class="custom-control-input">
                        {{option.value}}
                        <span class="custom-control-indicator"></span>
                    </label>
                </div>
                <small class="text-muted">{{templateOptions.description}}</small>
            </div>
        </div>
    `,
})
export class FormlyFieldMultiCheckbox extends Field {
  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    let controlGroupConfig = field.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = new FormControl(model ? model[option.key] : undefined);
      return previous;
    }, {});

    return new FormGroup(controlGroupConfig);
  }
}
