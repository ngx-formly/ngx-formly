import {
  Component, OnInit, OnChanges, EventEmitter, Input, Output, OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFormOptions } from './formly.field.config';
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
      this.renderField(this.field, this.containerRef);
    }

    this.triggerHook('onChanges');
    this.componentRefs.forEach(ref => {
      Object.assign(ref.instance, { field: this.field });
    });
  }

  ngOnDestroy() {
    this.triggerHook('onDestroy');
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

  private triggerHook(name: string) {
    if (this.field.hooks && this.field.hooks[name]) {
      this.field.hooks[name](this.field);
    }

    if (this.field.lifecycle && this.field.lifecycle[name]) {
      let field = this.field;
      while (field.parent) {
        field = field.parent;
      }

      this.field.lifecycle[name](
        <FormGroup>(field !== this.field ? field.formControl : null),
        this.field,
        this.field.model,
        this.field.options,
      );
    }
  }
}
