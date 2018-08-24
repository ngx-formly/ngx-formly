import {
  Component, OnInit, OnChanges, EventEmitter, Input, Output, OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyLifeCycleFn, FormlyLifeCycleOptions } from './formly.field.config';
import { FieldWrapper } from '../templates/field.wrapper';

@Component({
  selector: 'formly-field',
  template: `<ng-template #container></ng-template>`,
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
  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  private componentRefs: ComponentRef<FieldWrapper>[] = [];

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
      this.renderField(this.field, this.containerRef);
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

  private renderField(field: FormlyFieldConfig, containerRef: ViewContainerRef) {
    this.componentRefs.forEach(componentRef => componentRef.destroy());
    this.componentRefs = [];

    const wrappers = <any>(field.wrappers || []).map(wrapperName => this.formlyConfig.getWrapper(wrapperName));
    [...wrappers, this.formlyConfig.getType(field.type)].forEach(({ componentFactoryResolver, component }) => {
      const ref = containerRef.createComponent<FieldWrapper>(componentFactoryResolver.resolveComponentFactory(component));

      Object.assign(ref.instance, { form: this.form, options: this.options, field });
      this.componentRefs.push(ref);
      containerRef = ref.instance.fieldComponent;
    });
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
