import {
  Component, EventEmitter, Input, Output,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, Attribute, ComponentFactoryResolver,
  OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, Injector,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache } from './formly.field.config';
import { defineHiddenProp, wrapProperty } from '../utils';
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
  // TODO: remove `any`, once dropping angular `V7` support.
  @ViewChild('container', <any> {read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

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
    this.triggerHook('onChanges', changes);
  }

  ngOnDestroy() {
    this.field && defineHiddenProp(this.field, '_componentRefs', []);
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
      wrapProperty(ref.instance, 'fieldComponent', ({ currentValue, firstChange }) => {
        if (currentValue) {
          this.renderField(currentValue as ViewContainerRef, f, wps);
          !firstChange && ref.changeDetectorRef.detectChanges();
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

    if (this.field.lifecycle && this.field.lifecycle[name]) {
      this.field.lifecycle[name](
        this.field.form,
        this.field,
        this.field.model,
        this.field.options,
      );
    }

    if (name === 'onChanges' && changes.field) {
      this.renderField(this.containerRef, this.field, this.field.wrappers);
    }
  }

  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FormlyFieldConfigCache) {
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
  }
}
