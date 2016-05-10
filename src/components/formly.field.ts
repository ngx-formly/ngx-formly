import {
  Component, OnInit, Input, Output, EventEmitter, DynamicComponentLoader, ElementRef,
  ViewContainerRef, ViewChild, DoCheck, Directive
} from "angular2/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyConfig} from "../services/formly.config";
import {FormlyEventEmitter, FormlyPubSub} from "../services/formly.event.emitter";

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
         <div class="formly-field"
            *ngFor="let f of field.fieldGroup">
            <formly-field [hide]="f.hideExpression" [model]="model" [key]="f.key" [form]="form" [field]="f" (changeFn)="changeFunction($event, f)" [ngClass]="f.className" [eventEmitter]="eventEmitter"></formly-field>
        </div> 
    `,
  directives: [FormlyField, DivComponent]
})
export class FormlyField extends FormlyCommon implements DoCheck {
  // Inputs and Outputs
  @Input() model;
  @Input() key;
  @Input() form;
  @Input() field;
  @Input() eventEmitter;

  // Outputs
  @Output() changeFn: EventEmitter<any> = new EventEmitter();

  // Local Variables
  directives;
  hide;
  update;

  @ViewChild(DivComponent) myChild: DivComponent;

  constructor(protected dcl: DynamicComponentLoader, protected elem: ElementRef, fc: FormlyConfig, protected ps: FormlyPubSub) {
    super();
    this.directives = fc.getDirectives();
  }

  ngAfterViewInit() {
    if (this.field.hideExpression) {
      this.hide = true;
    } else {
      this.hide = false;
    }
    if (!!this.field.hideExpression || this.field.hideExpression === undefined && !this.field.template && !this.field.fieldGroup) {
      this.update = new FormlyEventEmitter();
      this.ps.setEmitter(this.key, this.update);
      this.dcl.loadNextToLocation(this.directives[this.field.type], this.myChild.viewContainer)
        .then(ref => {
          ref.instance.model = this.model[this.field.key];
          ref.instance.type = this.field.type;
          ref.instance.options = this.field.templateOptions;
          ref.instance.changeFn.subscribe((value) => {
            this.changeFn.emit(value);
          });
          ref.instance.key = this.key;
          ref.instance.form = this.form;
          ref.instance.update = this.update;
        });
    }
  }
  toggleFn(cond) {
    this.elem.nativeElement.style.display = cond ? "" : "none";
    if (this.field.fieldGroup) {
      for (let i = 0; i < this.field.fieldGroup.length; i++) {
        this.ps.getEmitter([this.field.fieldGroup[i].key]).emit({
          key: "hidden",
          value: !cond
        });
      }
    } else {
      this.ps.getEmitter(this.field.key).emit({
        key: "hidden",
        value: !cond
      });
    }
    this.eventEmitter.emit({
      key: this.field.key,
      value: !cond
    });
  }
  ngDoCheck() {
    if (this.field.hideExpression !== undefined && this.field.hideExpression !== this.hide)  {
      this.hide = this.field.hideExpression;
      if (this.hide) {
        this.toggleFn(false);
      } else {
        this.toggleFn(true);
      }
    }
  }
}
