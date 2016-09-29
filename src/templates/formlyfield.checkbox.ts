import {Component} from "@angular/core";
import {AbstractControl, FormBuilder} from "@angular/forms";
import {Field} from "./field";

@Component({
  selector: "formly-field-checkbox",
  template: `
    <div class="form-group">
      <div [formGroup]="form" class="checkbox">
        <label class="custom-control custom-checkbox">
          <input type="checkbox" [formControlName]="key"
            *ngIf="!templateOptions.hidden" value="on"
            class="custom-control-input">
            {{templateOptions.label}}
            <span class="custom-control-indicator"></span>
          </label>
      </div>
      <small class="text-muted">{{templateOptions.description}}</small>
    </div>
  `,
})
export class FormlyFieldCheckbox extends Field {
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  createControl(): AbstractControl {
    return this._control = this.formBuilder.control(this.model ? "on" : undefined);
  }
}
