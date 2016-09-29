
import {Component} from "@angular/core";
import {FormBuilder, AbstractControl} from "@angular/forms";
import {Field} from "./field";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";

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
  constructor(
    focusDispatcher: SingleFocusDispatcher,
    private formBuilder: FormBuilder,
  ) {
    super(focusDispatcher);
  }

  createControl(): AbstractControl {
    let controlGroupConfig = this.templateOptions.options.reduce((previous, option) => {
      previous[option.key] = [this.model ? this.model[option.key] : undefined];
      return previous;
    }, {});
    return this._control = this.formBuilder.group(controlGroupConfig);
  }
}
