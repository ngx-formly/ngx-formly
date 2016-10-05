import {Component} from "@angular/core";
import {Field} from "./../field";

@Component({
  selector: "formly-field-select",
  template: `
    <select [id]="key" [formControl]="formControl" class="form-control" [formlyNgFocus]="templateOptions.focus">
      <option value="" *ngIf="templateOptions.placeholder">{{templateOptions.placeholder}}</option>
      <option *ngFor="let option of templateOptions.options" [value]="option.value">{{option.label}}</option>
    </select>
  `,
})
export class FormlyFieldSelect extends Field {
}
