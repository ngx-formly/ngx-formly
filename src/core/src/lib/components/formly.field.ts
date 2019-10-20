import {
  Component, Input, Type,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, ComponentFactoryResolver,
  OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, Injector,
} from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFieldConfigCache } from './formly.field.config';
import { defineHiddenProp, assignModelValue } from '../utils';
import { FieldWrapper } from '../templates/field.wrapper';
import { FieldType } from '../templates/field.type';
import { debounceTime } from 'rxjs/operators';

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
  @Input('class') className = '';

  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

  refsUnsubscribe = () => {};
  valueChangesUnsubscribe = () => {};

  constructor(
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

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
      this.valueChangesUnsubscribe = this.valueChanges(this.field);
    }

    this.triggerHook('onChanges', changes);
  }

  ngOnDestroy() {
    this.triggerHook('onDestroy');
    this.refsUnsubscribe();
    this.valueChangesUnsubscribe();
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
  }

  private createWrapperRef<T extends FieldWrapper>(
    field: FormlyFieldConfigCache,
    containerRef: ViewContainerRef,
    config: { component: Type<T>; },
  ) {
    const cfr = field.options && field.options._componentFactoryResolver
      ? field.options._componentFactoryResolver
      : this.componentFactoryResolver;

    const ref = containerRef.createComponent<T>(cfr.resolveComponentFactory(config.component));
    this.attachComponentRef(ref, field);

    if (!ref.instance.fieldComponent) {
      throw Error(`${config.component.prototype.constructor.name}#fieldComponent: missing 'static' flag for '@ViewChild' query, it should be explicitly defined by '@ViewChild(..., { static: true })'.`);
    }

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

  private valueChanges(field: FormlyFieldConfigCache) {
    this.valueChangesUnsubscribe();
    if (field.key && field.type && !field.fieldGroup) {
      const control = field.formControl;
      const valueChanges = field.modelOptions.debounce && field.modelOptions.debounce.default
        ? control.valueChanges.pipe(debounceTime(field.modelOptions.debounce.default))
        : control.valueChanges;

      const sub = valueChanges.subscribe(value => {
        // workaround for https://github.com/angular/angular/issues/13792
        if ((control as any)._onChange.length > 1) {
          control.setValue(value, {emitEvent: false});
        }

        if (field.parsers && field.parsers.length > 0) {
          field.parsers.forEach(parserFn => value = parserFn(value));
        }

        assignModelValue(field.parent.model, [field.key], value);
        field.options.fieldChanges.next({ value, field, type: 'valueChanges' });
      });

      return () => sub.unsubscribe();
    }

    return () => {};
  }
}
