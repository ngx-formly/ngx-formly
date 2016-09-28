import {Input, OnInit} from "@angular/core";
import {FormGroup, FormControl, AbstractControl} from "@angular/forms";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";
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
  private _focus: boolean;

  constructor(protected focusDispatcher: SingleFocusDispatcher) {
    focusDispatcher.listen((key: String) => {
      if (this.key !== key) {
        this.focus = false;
      }
    });
  }

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

  set focus (newFocusValue: boolean) {
    if (!this._focus && newFocusValue) {
      this._focus = true;
      this.focusDispatcher.notify(this.key);
      // TODO: Raise a Event which can be used for streaming
    } else if (this._focus && !newFocusValue) {
      this._focus = false;
      // TODO: Raise a Event which can be used for streaming
    }
  }

  get focus (): boolean {
    return this._focus;
  }

  onInputFocus(): void {
    this.focus = true;
  }
}
