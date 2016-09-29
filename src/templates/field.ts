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

  _control: AbstractControl;
  focus: boolean;

  ngOnInit() {
    if (this.update) {
      this.update.subscribe((option: any) => {
        this.templateOptions[option.key] = option.value;
      });
    }

    if (this.templateOptions.focus) {
      this.focus = true;
    }
  }

  get formControl(): AbstractControl {
    if (!this._control) {
     this.createControl();
    }
    return this._control;
  }

  createControl(): void {
    this._control = new FormControl({ value: this.model || "", disabled: this.templateOptions.disabled }, this.field.validation);
  }
}
