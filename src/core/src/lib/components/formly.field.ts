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
    '[class]': 'field.className? field.className : className',
  },
})
export class FormlyField implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() field: FormlyFieldConfig;
  @Input('class') className: string = '';

  @Input() set model(m: any) {
    console.warn(`NgxFormly: passing 'model' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Input() set form(form: FormGroup) {
    console.warn(`NgxFormly: passing 'form' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Input() set options(options: FormlyFormOptions) {
    console.warn(`NgxFormly: passing 'options' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

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
      Object.assign(ref.instance, { field: this.field });
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
    [...wrappers, { ...this.formlyConfig.getType(field.type), componentFactory: (<any> field)._componentFactory }].forEach(({ componentFactoryResolver, component, componentRef }) => {
      const ref = componentRef ? componentRef : containerRef.createComponent<FieldWrapper>(componentFactoryResolver.resolveComponentFactory(component));

      Object.assign(ref.instance, { field });
      this.componentRefs.push(ref);
      containerRef = ref.instance.fieldComponent;
    });
  }

  private get lifecycle(): FormlyLifeCycleOptions {
    return this.field.lifecycle || {};
  }

  private lifeCycleHooks(callback: FormlyLifeCycleFn) {
    if (callback) {
      callback(
        <FormGroup> (this.field.parent ? this.field.parent.formControl : null),
        this.field,
        this.field.model,
        this.field.options,
      );
    }
  }
}
