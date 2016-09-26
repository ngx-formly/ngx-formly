import {ElementRef, DoCheck, Renderer} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {FormlyFieldExpressionDelegate, FormlyFieldVisibilityDelegate} from "../services/formly.field.delegates";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldConfig} from "./formly.field.config";

export class FormlyCommon implements DoCheck {
  formModel: any;
  model: any;
  field: FormlyFieldConfig;
  form: FormGroup;
  _hide: any;
  update: FormlyEventEmitter;
  visibilityDelegate = new FormlyFieldVisibilityDelegate(this);
  expressionDelegate = new FormlyFieldExpressionDelegate(this);

  constructor(
    protected elementRef: ElementRef,
    protected formlyPubSub: FormlyPubSub,
    private renderer: Renderer
  ) {}

  ngDoCheck() {
    this.visibilityDelegate.checkVisibilityChange();
    this.expressionDelegate.checkExpressionChange();
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
      this.formlyPubSub.getEmitter(fieldKey).emit(new FormlyValueChangeEvent(eventKey, value));
    }
  }
}
