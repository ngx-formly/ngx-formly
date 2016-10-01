import {Input} from "@angular/core";
import {FormGroup, AbstractControl} from "@angular/forms";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";

export abstract class Field {
  @Input() form: FormGroup;
  @Input() templateOptions: FormlyTemplateOptions;
  @Input() key: string;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;
  @Input() model: any;
  @Input() formControl: AbstractControl;
}
