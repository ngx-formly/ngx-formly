import {EventEmitter, ElementRef, DoCheck, Renderer} from "@angular/core";
import {FormlyFieldExpressionDelegate, FormlyFieldVisibilityDelegate} from "../services/formly.field.delegates";
import {FormlyPubSub} from "../services/formly.event.emitter";
import {FormlyConfig} from "../services/formly.config";
import {FormlyFieldConfig} from "./formly.field.config";
import {FormGroup} from "@angular/forms";

export class FormlyCommon implements DoCheck {
  formModel: any;
  field: FormlyFieldConfig;
  form: FormGroup;
  _hide: any;
  formSubmit = new EventEmitter();
  update;
  visibilityDelegate: FormlyFieldVisibilityDelegate;
  expressionDelegate: FormlyFieldExpressionDelegate;
  protected _model: any;

  constructor(
    protected elementRef: ElementRef,
    protected formlyPubSub: FormlyPubSub,
    protected formlyConfig: FormlyConfig,
    private renderer: Renderer
  ) {
    this.visibilityDelegate = new FormlyFieldVisibilityDelegate(this);
    this.expressionDelegate = new FormlyFieldExpressionDelegate(this);
  }

  ngDoCheck() {
    this.visibilityDelegate.checkVisibilityChange();
    this.expressionDelegate.checkExpressionChange();
  }

  get model(): any {
    return this._model;
  }

  set model(value) {
    this._model = value;
    this.formlyPubSub.Stream.emit(this.form);
  }

  get hide() {
    return this._hide;
  }

  set hide(value: boolean) {
    this._hide = value;
    this.renderer.setElementStyle(this.elementRef.nativeElement, "display", value ? "none" : "");
    if (this.field.fieldGroup) {
      for (let i = 0; i < this.field.fieldGroup.length; i++) {
        this.psEmit(this.field.fieldGroup[i].key, "hidden", this._hide);
      }
    } else {
      this.psEmit(this.field.key, "hidden", this._hide);
    }
  }

  private psEmit(fieldKey: string, eventKey: string, value: any) {
    if (this.formlyPubSub && this.formlyPubSub.getEmitter(fieldKey) && this.formlyPubSub.getEmitter(fieldKey).emit) {
      this.formlyPubSub.getEmitter(fieldKey).emit({
        key: eventKey,
        value: value
      });
    }
  }
}
