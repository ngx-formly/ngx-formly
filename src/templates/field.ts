import {Input, OnInit} from "@angular/core";
import {FormGroup, FormControl, AbstractControl} from "@angular/forms";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";
import {FormlyEventEmitter} from "../services/formly.event.emitter";

export abstract class Field implements OnInit {
  @Input() form: FormGroup;
  @Input() update: FormlyEventEmitter;
  @Input() templateOptions: FormlyTemplateOptions;
  @Input() key: string;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;
  @Input() model: any;
  @Input() formControl: AbstractControl;

  static createControl(model: any, field: FormlyFieldConfig): AbstractControl {
    return new FormControl({ value: model || "", disabled: field.templateOptions.disabled }, field.validation);
  }

  ngOnInit() {
    if (this.update) {
      this.update.subscribe((option: any) => {
        this.templateOptions[option.key] = option.value;
      });
    }
  }
}
