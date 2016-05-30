import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef,
  ViewContainerRef, ViewChild, Directive, ComponentRef, SimpleChange, OnChanges
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {FormlyConfig} from "../services/formly.config";
import {Field} from "../templates/field";

@Directive({
  selector: "[child-host]"
})
export class DivComponent {
  constructor(public viewContainer: ViewContainerRef) { }
}

@Component({
  selector: "formly-field",
  template: `
        <div child-host #child></div>
        <div *ngIf="field.template" [innerHtml]="field.template"></div>
    `,
  directives: [FormlyField, DivComponent],
  inputs: ["field", "formModel", "form", "hide", "model", "key", "eventEmitter"],
  outputs: ["formSubmit", "changeFn", "eventEmitter"]
})
export class FormlyField extends FormlyCommon implements OnInit, OnChanges {

  eventEmitter;

  // Outputs
  changeFn: EventEmitter<any> = new EventEmitter();

  update;

  // FIXME: See https://github.com/formly-js/ng2-formly/issues/45; This is a temporary fix.
  modelUpdateEmitter: EventEmitter<any> = new EventEmitter();

  @ViewChild(DivComponent) myChild: DivComponent;
  private childFieldRef: ComponentRef<Field>;

  constructor(elem: ElementRef, ps: FormlyPubSub, protected fb: FormlyFieldBuilder,
              formlyConfig: FormlyConfig) {
    super(elem, ps, formlyConfig);
  }

  ngOnInit(): any {
    this.createChildFields();
  }

  ngAfterViewInit() {}

  createChildFields() {
    if (this.field && !this.field.template && !this.field.fieldGroup) {
      this.update = new FormlyEventEmitter();
      this.fb.createChildFields(this.field, this, this.formlyConfig).then((ref: ComponentRef<any>) => {
        this.childFieldRef = ref;
        this.childFieldRef.instance.modelUpdateReceiver = this.modelUpdateEmitter;
        ref.instance.changeFn.subscribe((event) => {
          this.changeFunction(event, this.field);
        });
      });
      this.ps.setEmitter(this.key, this.update);
    }
  }

  changeFunction(event: FormlyValueChangeEvent, field) {
    if (this.key && this.key === event.key) {
      this._model = event.value;
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    } else if (this.key && this.key !== event.key) {
      this._model[event.key] = event.value;
      this.changeFn.emit(new FormlyValueChangeEvent(this.key, this._model));
      this.formSubmit.emit(event);
    } else {
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    }
  }

  ngOnChanges(changes: {
    [key: string]: SimpleChange;
  }): any {
    if (changes["model"]) {
      // FIXME: See https://github.com/formly-js/ng2-formly/issues/45. This is a temporary fix.
      this.modelUpdateEmitter.emit(changes["model"].currentValue);
    }
  }
}
