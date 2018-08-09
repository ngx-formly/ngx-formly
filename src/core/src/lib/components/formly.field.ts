import {
  Component, OnInit, OnChanges, EventEmitter, Input, Output, OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FieldType } from '../templates/field.type';
import { FormlyFieldConfig, FormlyFormOptions, FormlyLifeCycleFn, FormlyLifeCycleOptions } from './formly.field.config';

@Component({
  selector: 'formly-field',
  template: `
    <ng-template #fieldComponent></ng-template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>
  `,
  host: {
    '[style.display]': 'field.hide ? "none":""',
  },
})
export class FormlyField implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() set model(m: any) {
    console.warn(`NgxFormly: passing 'model' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() options: FormlyFormOptions = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  private componentRefs: ComponentRef<FieldType>[] = [];

  constructor(private formlyConfig: FormlyConfig) {}

  ngAfterContentInit() {
    this.lifeCycleHooks(this.lifecycle.afterContentInit);
  }

  ngAfterContentChecked() {
    this.lifeCycleHooks(this.lifecycle.afterContentChecked);
  }

  ngAfterViewInit() {
    this.lifeCycleHooks(this.lifecycle.afterViewInit);
  }

  ngAfterViewChecked() {
    this.lifeCycleHooks(this.lifecycle.afterViewChecked);
  }

  ngDoCheck() {
    this.lifeCycleHooks(this.lifecycle.doCheck);
  }

  ngOnInit() {
    this.lifeCycleHooks(this.lifecycle.onInit);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      this.renderField();
    }

    this.lifeCycleHooks(this.lifecycle.onChanges);
    this.componentRefs.forEach(ref => {
      Object.assign(ref.instance, {
        form: this.form,
        field: this.field,
        options: this.options,
      });
    });
  }

  ngOnDestroy() {
    this.lifeCycleHooks(this.lifecycle.onDestroy);
    this.componentRefs.forEach(componentRef => componentRef.destroy());
    this.componentRefs = [];
  }

  private renderField(): ComponentRef<FieldType> {
    this.componentRefs.forEach(componentRef => componentRef.destroy());
    this.componentRefs = [];
    if (this.field.template) {
      return;
    }

    const type = this.formlyConfig.getType(this.field.type);

    let fieldComponent = this.fieldComponent;
    (this.field.wrappers || []).forEach(wrapperName => {
      const wrapper = this.formlyConfig.getWrapper(wrapperName);
      const wrapperRef = this.createComponent(wrapper.componentFactoryResolver, fieldComponent, wrapper.component);
      fieldComponent = wrapperRef.instance.fieldComponent;
    });

    return this.createComponent(type.componentFactoryResolver, fieldComponent, type.component);
  }

  private createComponent(componentFactoryResolver: ComponentFactoryResolver, fieldComponent: ViewContainerRef, component: any): ComponentRef<any> {
    let componentFactory = componentFactoryResolver.resolveComponentFactory(component);
    let ref = <ComponentRef<FieldType>>fieldComponent.createComponent(componentFactory);

    Object.assign(ref.instance, {
        form: this.form,
        field: this.field,
        options: this.options,
    });

    this.componentRefs.push(ref);

    return ref;
  }

  private get lifecycle(): FormlyLifeCycleOptions {
    return this.field.lifecycle || {};
  }

  private lifeCycleHooks(callback: FormlyLifeCycleFn) {
    if (callback) {
      callback(this.form, this.field, this.field.model, this.options);
    }
  }
}
