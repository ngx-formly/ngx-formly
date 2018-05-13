import {
  Component, OnInit, OnChanges, EventEmitter, Input, Output, OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, ComponentFactoryResolver, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { Field } from '../templates/field';
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
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() options: FormlyFormOptions = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  private componentRefs: ComponentRef<Field>[] = [];

  constructor(
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

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
    if (!this.field.template) {
      this.createFieldComponent();
    }
    this.lifeCycleHooks(this.lifecycle.onInit);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lifeCycleHooks(this.lifecycle.onChanges);
    this.componentRefs.forEach(ref => {
      Object.assign(ref.instance, {
        model: this.model,
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

  private createFieldComponent(): ComponentRef<Field> {
    const type = this.formlyConfig.getType(this.field.type);

    let fieldComponent = this.fieldComponent;
    (this.field.wrappers || []).forEach(wrapperName => {
      const wrapperRef = this.createComponent(fieldComponent, this.formlyConfig.getWrapper(wrapperName).component);
      fieldComponent = wrapperRef.instance.fieldComponent;
    });

    return this.createComponent(fieldComponent, type.component);
  }

  private createComponent(fieldComponent: ViewContainerRef, component: any): ComponentRef<any> {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let ref = <ComponentRef<Field>>fieldComponent.createComponent(componentFactory);

    Object.assign(ref.instance, {
        model: this.model,
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
      callback(this.form, this.field, this.model, this.options);
    }
  }
}
