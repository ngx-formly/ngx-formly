import {
  Component, OnInit, EventEmitter, ElementRef, Input, Output, DoCheck,
  ViewContainerRef, ViewChild, ComponentRef, Renderer, ComponentFactoryResolver,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent } from '../services/formly.event.emitter';
import { FormlyConfig } from '../services/formly.config';
import { Field } from '../templates/field';
import { FormlyFieldExpressionDelegate, FormlyFieldVisibilityDelegate } from '../services/formly.field.delegates';
import { FormlyFieldConfig } from './formly.field.config';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'formly-field',
  template: `
    <template #fieldComponent></template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>
  `,
})
export class FormlyField implements DoCheck, OnInit {
  @Input() formModel: any;
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() field: FormlyFieldConfig;
  @Input() options;
  @Input()
  get hide() { return this._hide; }
  set hide(value: boolean) {
    this._hide = value;
    this.renderer.setElementStyle(this.elementRef.nativeElement, 'display', value ? 'none' : '');
    if (this.field.fieldGroup) {
      for (let i = 0; i < this.field.fieldGroup.length; i++) {
        this.psEmit(this.field.fieldGroup[i].key, 'hidden', this._hide);
      }
    } else {
      this.psEmit(this.field.key, 'hidden', this._hide);
    }
  }

  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
  private visibilityDelegate = new FormlyFieldVisibilityDelegate(this);
  private expressionDelegate = new FormlyFieldExpressionDelegate(this);
  private _hide;

  constructor(
    private elementRef: ElementRef,
    private formlyPubSub: FormlyPubSub,
    private renderer: Renderer,
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngDoCheck() {
    this.visibilityDelegate.checkVisibilityChange();
    this.expressionDelegate.checkExpressionChange();
  }

  ngOnInit() {
    this.createFieldComponents();
  }

  changeModel(event: FormlyValueChangeEvent) {
    this.modelChange.emit(event);
  }

  private createFieldComponents() {
    if (this.field && !this.field.template && !this.field.fieldGroup && !this.field.fieldArray) {
      let debounce = 0;
      if (this.field.modelOptions && this.field.modelOptions.debounce && this.field.modelOptions.debounce.default) {
        debounce = this.field.modelOptions.debounce.default;
      }
      let fieldComponentRef = this.createFieldComponent();

      if (this.field.key) {
        let valueChanges = fieldComponentRef.instance.formControl.valueChanges;
        if (debounce > 0) {
          valueChanges = valueChanges.debounceTime(debounce);
        }
        if (this.field.parsers && this.field.parsers.length > 0) {
          this.field.parsers.map(parserFn => {
            valueChanges = valueChanges.map(parserFn);
          });
        }

        valueChanges.subscribe((event) => this
          .changeModel(new FormlyValueChangeEvent(this.field.key, event))
        );
      }

      let update = new FormlyEventEmitter();
      update.subscribe((option: any) => {
        this.field.templateOptions[option.key] = option.value;
      });

      this.formlyPubSub.setEmitter(this.field.key, update);
    } else if (this.field.fieldGroup || this.field.fieldArray) {
      this.createFieldComponent();
    }

    // TODO support this.field.hideExpression as a callback/observable
    this.hide = this.field.hideExpression ? true : false;
  }

  private createFieldComponent(): ComponentRef<Field> {
    if (this.field.fieldGroup) {
      this.field.type = this.field.type || 'formly-group';
    }
    let type = this.formlyConfig.getType(this.field.type);
    let fieldComponent = this.fieldComponent;
    const fieldManipulators = this.getManipulators(this.field.templateOptions);
    let preWrappers = this.runManipulators(fieldManipulators.preWrapper, this.field);
    let postWrappers = this.runManipulators(fieldManipulators.postWrapper, this.field);
    if (!type.wrappers) type.wrappers = [];
    if (!this.field.wrappers) this.field.wrappers = [];
    let wrappers = [...preWrappers, ...this.field.wrappers, ...postWrappers];
    wrappers.map(wrapperName => {
      let wrapperRef = this.createComponent(fieldComponent, this.formlyConfig.getWrapper(wrapperName).component);
      fieldComponent = wrapperRef.instance.fieldComponent;
    });

    return this.createComponent(fieldComponent, type.component);
  }

  private createComponent(fieldComponent, component): ComponentRef<any> {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let ref = <ComponentRef<Field>>fieldComponent.createComponent(componentFactory);

    Object.assign(ref.instance, {
        model: this.model,
        form: this.form,
        field: this.field,
        formModel: this.formModel,
        options: this.options,
    });

    return ref;
  }

  private psEmit(fieldKey: string, eventKey: string, value: any) {
    if (this.formlyPubSub && this.formlyPubSub.getEmitter(fieldKey) && this.formlyPubSub.getEmitter(fieldKey).emit) {
      this.formlyPubSub.getEmitter(fieldKey).emit(new FormlyValueChangeEvent(eventKey, value));
    }
  }

  private getManipulators(options) {
    let preWrapper = [];
    let postWrapper = [];
    if (options && options.templateManipulators) {
      addManipulators(options.templateManipulators);
    }
    addManipulators(this.formlyConfig.templateManipulators);
    return {preWrapper, postWrapper};

    function addManipulators(manipulators) {
      const {preWrapper: pre = [], postWrapper: post = []} = (manipulators || {});
      preWrapper = preWrapper.concat(pre);
      postWrapper = postWrapper.concat(post);
    }
  }

  private runManipulators(manipulators: Function[], field: FormlyFieldConfig) {
    let wrappers = [];
    if (manipulators) {
      manipulators.map(manipulator => {
        if (manipulator(field)) {
          wrappers.push(manipulator(field));
        }
      });
      return wrappers;
    }
  }
}
