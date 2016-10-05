import {Component} from "@angular/core";
import {Field} from "./field";

@Component({
  selector: "formly-field-radio",
  template: `
    <div *ngFor="let option of templateOptions.options" class="radio">
      <label class="custom-control custom-radio">
        <input type="radio" [value]="option.key" [formControl]="form.get(key)"
        [formlyNgFocus]="templateOptions.focus" class="custom-control-input">
        {{option.value}}
        <span class="custom-control-indicator"></span>
      </label>
    </div>
  `,
})
export class FormlyFieldRadio extends Field {
}
