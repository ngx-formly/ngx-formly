import {
  Component, EventEmitter, Input, Output, Type,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, Attribute, ComponentFactoryResolver,
  OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, Injector,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from './formly.field.config';
import { defineHiddenProp } from '../utils';
import { FieldWrapper } from '../templates/field.wrapper';
import { FieldType } from '../templates/field.type';

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

  warnDeprecation = false;

  @Input() set model(m: any) {
    this.warnDeprecation && console.warn(`NgxFormly: passing 'model' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Input() set form(form: FormGroup) {
    this.warnDeprecation && console.warn(`NgxFormly: passing 'form' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Input() set options(options: FormlyFormOptions) {
    this.warnDeprecation && console.warn(`NgxFormly: passing 'options' input to '${this.constructor.name}' component is not required anymore, you may remove it!`);
  }

  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  refsUnsubscribe = () => {};

  constructor(
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    // tslint:disable-next-line
    @Attribute('hide-deprecation') hideDeprecation,
  ) {
    this.warnDeprecation = hideDeprecation === null;
  }

  ngAfterContentInit() {
    this.triggerHook('afterContentInit');
  }

  ngAfterContentChecked() {
    this.triggerHook('afterContentChecked');
  }

  ngAfterViewInit() {
    this.triggerHook('afterViewInit');
  }

  ngAfterViewChecked() {
    this.triggerHook('afterViewChecked');
  }

  ngDoCheck() {
    this.triggerHook('doCheck');
  }

  ngOnInit() {
    this.triggerHook('onInit');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      this.refsUnsubscribe = this.renderField(this.field, this.containerRef);
    }

    this.triggerHook('onChanges', changes);
  }

  ngOnDestroy() {
    this.triggerHook('onDestroy');
    this.refsUnsubscribe();
  }

  private renderField(f: FormlyFieldConfigCache, containerRef: ViewContainerRef) {
    this.refsUnsubscribe();
    (f.wrappers || []).forEach(wrapper => {
      containerRef = this.createWrapperRef(f, containerRef, this.formlyConfig.getWrapper(wrapper));
    });

    const ref = this.formlyConfig.createComponent(f, this.componentFactoryResolver, this.injector);
    if (ref) {
      containerRef.insert(ref.hostView);
      this.attachComponentRef(ref, f);
    }

    return () => {
      (f._componentRefs || []).forEach(componentRef => componentRef.destroy());
      f._componentRefs = [];
    };
  }

  private triggerHook(name: string, changes?: SimpleChanges) {
    if (this.field.hooks && this.field.hooks[name]) {
      if (!changes || changes.field) {
        this.field.hooks[name](this.field);
      }
    }

    if (this.field.lifecycle && this.field.lifecycle[name]) {
      this.field.lifecycle[name](
        this.field.form,
        this.field,
        this.field.model,
        this.field.options,
      );
    }
  }

  private createWrapperRef<T extends FieldWrapper>(
    field: FormlyFieldConfig,
    containerRef: ViewContainerRef,
    config: { component: Type<T>; },
  ) {
    const ref = containerRef.createComponent<T>(
      this.componentFactoryResolver.resolveComponentFactory(config.component),
    );
    this.attachComponentRef(ref, field);

    return ref.instance.fieldComponent;
  }

  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FormlyFieldConfigCache) {
    if (field._componentRefs) {
      field._componentRefs.push(ref);
    } else {
      defineHiddenProp(field, '_componentRefs', [ref]);
    }
    Object.assign(ref.instance, { field });
  }
}
