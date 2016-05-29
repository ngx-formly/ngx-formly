import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef,
  ViewContainerRef, ViewChild, Directive, ComponentRef, SimpleChange
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyFieldBuilder} from "../services/formly.field.builder";
import {FormlyConfig} from "../services/formly.config";

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
  inputs: ["field", "formModel", "form", "hide", "viewModel", "key"]
})
export class FormlyField extends FormlyCommon implements OnInit {

  @Input() eventEmitter;

  // Outputs
  @Output() changeFn: EventEmitter<any> = new EventEmitter();

  update;

  @ViewChild(DivComponent) myChild: DivComponent;
  private childFieldRef: ComponentRef<any>;

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
        ref.instance.changeFn.subscribe((event) => {
          this.changeFunction(event, this.field);
        });
      });
      this.ps.setEmitter(this.key, this.update);
    }
  }

  changeFunction(event: FormlyValueChangeEvent, field) {
    if (this.key && this.key === event.key) {
      this._viewModel = event.value;
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    } else if (this.key && this.key !== event.key) {
      this._viewModel[event.key] = event.value;
      this.changeFn.emit(new FormlyValueChangeEvent(this.key, this._viewModel));
      this.formSubmit.emit(event);
    } else {
      this.changeFn.emit(event);
      this.formSubmit.emit(event);
    }
  }
}
