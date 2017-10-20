import {
  Component, OnInit, EventEmitter, ElementRef, Input, Output, DoCheck, OnDestroy,
  ViewContainerRef, ViewChild, ComponentRef, Renderer2, ComponentFactoryResolver,
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormlyConfig, TypeOption } from '../services/formly.config';
import { Field } from '../templates/field';
import { evalExpression } from '../utils';
import { FormlyFieldConfig, FormlyOptions, FormlyValueChangeEvent } from './formly.field.config';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'formly-field',
  template: `
    <ng-template #fieldComponent></ng-template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>
  `,
})
export class FormlyField implements DoCheck, OnInit, OnDestroy {
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() options: FormlyOptions = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  private componentRefs: ComponentRef<Field>[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  ngDoCheck() {
    this.checkExpressionChange();
    this.checkVisibilityChange();
  }

  ngOnInit() {
    this.createFieldComponents();
    if (this.field.hide === true) {
      this.toggleHide(true);
    }
  }

  ngOnDestroy() {
    this.componentRefs.map(componentRef => componentRef.destroy());
    this._subscriptions.map(subscriber => subscriber.unsubscribe());
    this._subscriptions = this.componentRefs = [];
  }

  private createFieldComponents() {
    if (this.field && !this.field.template && !this.field.fieldGroup && !this.field.fieldArray) {
      let debounce = 0;
      if (this.field.modelOptions && this.field.modelOptions.debounce && this.field.modelOptions.debounce.default) {
        debounce = this.field.modelOptions.debounce.default;
      }

      const fieldComponentRef = this.createFieldComponent();
      if (this.field.key) {
        let valueChanges = fieldComponentRef.instance.formControl.valueChanges;
        if (debounce > 0) {
          valueChanges = debounceTime.call(valueChanges, debounce);
        }
        if (this.field.parsers && this.field.parsers.length > 0) {
          this.field.parsers.map(parserFn => {
            valueChanges = map.call(valueChanges, parserFn);
          });
        }

        this._subscriptions.push(valueChanges.subscribe((event) =>
          this.modelChange.emit({ key: this.field.key, value: event }),
        ));
      }
    } else if (this.field.fieldGroup || this.field.fieldArray) {
      this.createFieldComponent();
    }
  }

  private createFieldComponent(): ComponentRef<Field> {
    if (this.field.fieldGroup) {
      this.field.type = this.field.type || 'formly-group';
    }
    const type = this.formlyConfig.getType(this.field.type),
      wrappers = this.getFieldWrappers(type);

    let fieldComponent = this.fieldComponent;
    wrappers.map(wrapperName => {
      let wrapperRef = this.createComponent(fieldComponent, this.formlyConfig.getWrapper(wrapperName).component);
      fieldComponent = wrapperRef.instance.fieldComponent;
    });

    return this.createComponent(fieldComponent, type.component);
  }

  private getFieldWrappers(type: TypeOption) {
    let templateManipulators = {
      preWrapper: [],
      postWrapper: [],
    };

    if (this.field.templateOptions) {
      this.mergeTemplateManipulators(templateManipulators, this.field.templateOptions.templateManipulators);
    }

    this.mergeTemplateManipulators(templateManipulators, this.formlyConfig.templateManipulators);

    let preWrappers = templateManipulators.preWrapper.map(m => m(this.field)).filter(type => type),
      postWrappers = templateManipulators.postWrapper.map(m => m(this.field)).filter(type => type);

    if (!this.field.wrappers) this.field.wrappers = [];
    if (!type.wrappers) type.wrappers = [];

    return [...preWrappers, ...this.field.wrappers, ...postWrappers];
  }

  private mergeTemplateManipulators(source, target) {
    target = target || {};
    if (target.preWrapper) {
      source.preWrapper = source.preWrapper.concat(target.preWrapper);
    }
    if (target.postWrapper) {
      source.postWrapper = source.postWrapper.concat(target.postWrapper);
    }

    return source;
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

  private checkVisibilityChange() {
    if (this.field && this.field.hideExpression) {
      const hideExpressionResult: boolean = !!evalExpression(
        this.field.hideExpression,
        this,
        [this.model, this.options.formState],
      );

      if (hideExpressionResult !== this.field.hide) {
        this.toggleHide(hideExpressionResult);
      }
    }
  }

  private checkExpressionChange() {
    if (this.field && this.field.expressionProperties) {
      const expressionProperties = this.field.expressionProperties;

      for (let key in expressionProperties) {
        const expressionValue = evalExpression(
          expressionProperties[key].expression,
          this,
          [this.model, this.options.formState],
        );

        if (expressionProperties[key].expressionValue !== expressionValue) {
          expressionProperties[key].expressionValue = expressionValue;
          evalExpression(
            expressionProperties[key].expressionValueSetter,
            this,
            [expressionValue, this.model, this.field.templateOptions, this.field.validation],
          );
        }
      }

      const formControl = this.field.formControl;
      if (formControl) {
        if (formControl.status === 'DISABLED' && !this.field.templateOptions.disabled) {
            formControl.enable();
        }
        if (formControl.status !== 'DISABLED' && this.field.templateOptions.disabled) {
            formControl.disable();
        }
      }
    }
  }

  private toggleHide(value: boolean) {
    this.field.hide = value;
    if (this.field.formControl) {
      if (value === true && this.form.get(this.field.key)) {
        setTimeout(() => this.removeFieldControl());
      } else if (value === false && !this.form.get(this.field.key)) {
        setTimeout(() => this.addFieldControl());
      }
    }

    this.renderer.setStyle(this.elementRef.nativeElement, 'display', value ? 'none' : '');

    this.field.templateOptions.hidden = value;
    if (this.options.fieldChanges) {
      this.options.fieldChanges.next(<FormlyValueChangeEvent> { field: this.field, type: 'hidden', value });
    }
  }

  private get fieldKey() {
    return this.field.key.split('.').pop();
  }

  private get fieldParentFormControl(): FormArray|FormGroup {
      const paths = this.field.key.split('.');
      paths.pop(); // remove last path

      return (paths.length > 0 ? this.form.get(paths) : this.form) as any;
  }

  private addFieldControl() {
    const parent = this.fieldParentFormControl;

    if (parent instanceof FormArray) {
      parent.push(this.field.formControl);
    } else if (parent instanceof FormGroup) {
      parent.addControl(this.fieldKey, this.field.formControl);
    }
  }

  private removeFieldControl() {
    const parent = this.fieldParentFormControl;

    if (parent instanceof FormArray) {
      parent.removeAt(this.fieldKey as any);
    } else if (parent instanceof FormGroup) {
      parent.removeControl(this.fieldKey);
    }
  }
}
