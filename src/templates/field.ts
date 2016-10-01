import {Input} from "@angular/core";
import {FormGroup, FormControl, AbstractControl} from "@angular/forms";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";

export abstract class Field {
  @Input() form: FormGroup;
  @Input() templateOptions: FormlyTemplateOptions;
  @Input() key: string;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;
  @Input() model: any;
  @Input() formControl: AbstractControl;

  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    return new FormControl({ value: model || "", disabled: field.templateOptions.disabled }, field.validation);
  }
}
