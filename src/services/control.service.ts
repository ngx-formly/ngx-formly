import {Injectable}   from "@angular/core";
import {FormBuilder, ControlGroup, RadioButtonState} from "@angular/common";
import {FieldBase} from "./field.base";

@Injectable()
export class ControlService {
  constructor(private _fb: FormBuilder) { }

  toControlGroup(fields: FieldBase<any>[], model, key, value ): ControlGroup {
    let group = {};

    fields.forEach(field => {
      if (!field.template && !field.fieldGroup) {
        group[field.key] =  getControlGroup(this._fb, field);
      } else if (field.fieldGroup) {
        field.fieldGroup.forEach(f => {
          group[f.key] = getControlGroup(this._fb, f);
        });
      }
    });

    function getControlGroup(formBuilder, field) {
      let control;
      if (field.type === "radio") {
        let group = {};
        field.templateOptions.options.forEach(option => {
          group[option.key] = [new RadioButtonState(model[field.key] === option.value , option.key)];
        });
        control = formBuilder.group(group);
      } else if (field.type === "multicheckbox") {
        let group = {};
        field.templateOptions.options.forEach(option => {
          group[option.key] = [model[field.key] ? model[field.key][option.key] : undefined];
        });
        control = formBuilder.group(group);
      } else if (field.type === "checkbox") {
        control = [(model[field.key] ? "on" : undefined), field.key === key && value ? undefined : field.validation];
      } else {
        control = [model[field.key] || "", field.key === key && value ? undefined : field.validation];
      }

      return control;
    }

    return this._fb.group(group);
  }
}
