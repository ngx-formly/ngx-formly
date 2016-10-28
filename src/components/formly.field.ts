import {
  Component, OnInit, EventEmitter, ElementRef, Input, Output, DoCheck,
  ViewContainerRef, ViewChild, ComponentRef, Renderer, ComponentFactoryResolver,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent } from '../services/formly.event.emitter';
import { FormlyConfig } from '../services/formly.config';
import { Field } from '../templates/field';
import { FormlyFieldExpressionDelegate, FormlyFieldVisibilityDelegate } from '../services/formly.field.delegates';
import { FormlyFieldConfig } from './formly.field.config';
import { FormlyUtils } from './../services/formly.utils';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'formly-field',
  template: `
    <template #fieldComponent></template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>

    <formly-field *ngFor="let f of field.fieldGroup; let i = index"
      [hide]="f.hideExpression"
      [model]="model?(f.key ? model[f.key]: model):''"
      [form]="fieldGroupForm" [field]="f" [formModel]="formModel"
      (modelChange)="changeModel($event)"
      [ngClass]="f.className"
      [index]="i"
      [formId]="formId">
    </formly-field>
  `,
})
export class FormlyField implements DoCheck, OnInit {
  @Input() formModel: any;
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() index: string;
  @Input() formId: string;
  @Input()
  get hide() { return this._hide; }
  set hide(value: boolean) {
    this._hide = value;
    this.renderer.setElementStyle(this.elementRef.nativeElement, 'display', value ? 'none' : '');
    if (this.field.fieldGroup) {
      for (let i = 0; i < this.field.fieldGroup.length; i++) {
        this.psEmit(this.field.fieldGroup[i].key, 'hidden', this._hide);
      }
    } else {
      this.psEmit(this.field.key, 'hidden', this._hide);
    }
  }

  get id() {
    return this.formlyUtils.getFieldId(this.formId, this.field, this.index);
  }

  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
  private visibilityDelegate = new FormlyFieldVisibilityDelegate(this);
  private expressionDelegate = new FormlyFieldExpressionDelegate(this);
  private _hide;

  constructor(
    private elementRef: ElementRef,
    private formlyPubSub: FormlyPubSub,
    private renderer: Renderer,
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private formlyUtils: FormlyUtils
  ) {}

  ngDoCheck() {
    this.visibilityDelegate.checkVisibilityChange();
    this.expressionDelegate.checkExpressionChange();
  }

  ngOnInit() {
    this.createChildFields();
  }

  get fieldGroupForm() {
    if (this.field.key && this.form.get(this.field.key)) {
      return <FormGroup>this.form.get(this.field.key);
    }

    return this.form;
  }

  changeModel(event: FormlyValueChangeEvent) {
    if (this.field.fieldGroup && this.field.key) {
      event = new FormlyValueChangeEvent(`${this.field.key}.${event.key}`, event.value);
    }

    this.modelChange.emit(event);
  }

  private createChildFields() {
    if (this.field && !this.field.template && !this.field.fieldGroup && !this.field.fieldArray) {
      let debounce = 0;
      if (this.field.modelOptions && this.field.modelOptions.debounce && this.field.modelOptions.debounce.default) {
        debounce = this.field.modelOptions.debounce.default;
      }
      let fieldComponentRef = this.createFieldComponent();
      fieldComponentRef.instance.formControl.valueChanges
        .debounceTime(debounce)
        .subscribe((event) => {
          this.changeModel(new FormlyValueChangeEvent(this.field.key, event));
        });

      let update = new FormlyEventEmitter();
      update.subscribe((option: any) => {
        this.field.templateOptions[option.key] = option.value;
      });

      this.formlyPubSub.setEmitter(this.field.key, update);
    } else if (this.field.fieldArray) {
      this.createFieldComponent();
    }
  }

  private createFieldComponent(): ComponentRef<Field> {
    // TODO support this.field.hideExpression as a callback/observable
    this.hide = this.field.hideExpression ? true : false;

    let type = this.formlyConfig.getType(this.field.type);
    let fieldComponent = this.fieldComponent;
    if (type.wrappers) {
      type.wrappers.map(wrapperName => {
        let wrapperRef = this.createComponent(fieldComponent, this.formlyConfig.getWrapper(wrapperName).component);
        fieldComponent = wrapperRef.instance.fieldComponent;
      });
    }

    return this.createComponent(fieldComponent, type.component);
  }

  private createComponent(fieldComponent, component): ComponentRef<any> {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let ref = <ComponentRef<Field>>fieldComponent.createComponent(componentFactory);
    Object.assign(ref.instance, {
        model: this.model,
        form: this.form,
        field: this.field,
        formModel: this.formModel,
    });

    return ref;
  }

  private psEmit(fieldKey: string, eventKey: string, value: any) {
    if (this.formlyPubSub && this.formlyPubSub.getEmitter(fieldKey) && this.formlyPubSub.getEmitter(fieldKey).emit) {
      this.formlyPubSub.getEmitter(fieldKey).emit(new FormlyValueChangeEvent(eventKey, value));
    }
  }
}
