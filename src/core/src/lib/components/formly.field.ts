import {
  Component, Input,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, ComponentFactoryResolver,
  OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, Injector,
} from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFieldConfigCache } from './formly.field.config';
import { defineHiddenProp, assignModelValue, wrapProperty, getKeyPath } from '../utils';
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
    this.triggerHook('onChanges', changes);
  }

  ngOnDestroy() {
    this.field && defineHiddenProp(this.field, '_componentRefs', []);
    this.valueChangesUnsubscribe();
    this.triggerHook('onDestroy');
  }

  private renderField(containerRef: ViewContainerRef, f: FormlyFieldConfigCache, wrappers: string[]) {
    if (this.containerRef === containerRef) {
      defineHiddenProp(this.field, '_componentRefs', []);
      this.containerRef.clear();
    }

    if (wrappers && wrappers.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const { component } = this.formlyConfig.getWrapper(wrapper);
      const cfr = f.options && f.options._componentFactoryResolver
        ? f.options._componentFactoryResolver
        : this.componentFactoryResolver;

      const ref = containerRef.createComponent<FieldWrapper>(cfr.resolveComponentFactory(component));
      this.attachComponentRef(ref, f);
      wrapProperty(ref.instance, 'fieldComponent', ({ currentValue }) => {
        if (currentValue) {
          this.renderField(currentValue as ViewContainerRef, f, wps);
        }
      });
    } else {
      const ref = this.formlyConfig.createComponent(f, this.componentFactoryResolver, this.injector);
      if (ref) {
        this.attachComponentRef(ref, f);
        containerRef.insert(ref.hostView);
      }
    }
  }

  private triggerHook(name: string, changes?: SimpleChanges) {
    if (this.field.hooks && this.field.hooks[name]) {
      if (!changes || changes.field) {
        this.field.hooks[name](this.field);
      }
    }

    if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
      this.renderField(this.containerRef, this.field, this.field.wrappers);
      this.valueChangesUnsubscribe = this.valueChanges(this.field);
    }
  }

  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FormlyFieldConfigCache) {
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
    ref.changeDetectorRef.detectChanges();
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

        assignModelValue(field.parent.model, getKeyPath(field), value);
        field.options.fieldChanges.next({ value, field, type: 'valueChanges' });
      });

      return () => sub.unsubscribe();
    }

    return () => {};
  }
}
