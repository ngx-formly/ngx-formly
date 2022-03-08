import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  SimpleChanges,
  DoCheck,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterContentInit,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ChangeDetectionStrategy,
  EmbeddedViewRef,
  Optional,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFieldConfigCache, FormlyHookConfig } from '../models';
import {
  defineHiddenProp,
  observe,
  observeDeep,
  getFieldValue,
  assignFieldValue,
  isObject,
  isNil,
  markFieldForCheck,
  hasKey,
  IObserver,
} from '../utils';
import { FieldWrapper } from '../templates/field.wrapper';
import { FieldType } from '../templates/field.type';
import { isObservable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FormlyFieldTemplates } from './formly.template';

@Component({
  selector: 'formly-field',
  template: '<ng-template #container></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyField implements DoCheck, OnInit, OnChanges, AfterContentInit, AfterViewInit, OnDestroy {
  @Input() field: FormlyFieldConfig;
  @ViewChild('container', { read: ViewContainerRef, static: true }) viewContainerRef!: ViewContainerRef;

  private hostObservers: IObserver<any>[] = [];
  private componentRefs: (ComponentRef<FieldType> | EmbeddedViewRef<FieldType>)[] = [];
  private hooksObservers: Function[] = [];
  private detectFieldBuild = false;

  private get containerRef() {
    return this.config.extras.renderFormlyFieldElement ? this.viewContainerRef : this.hostContainerRef;
  }

  private get elementRef() {
    if (this.config.extras.renderFormlyFieldElement) {
      return this._elementRef;
    }
    if (this.componentRefs?.[0] instanceof ComponentRef) {
      return this.componentRefs[0].location;
    }

    return null;
  }

  valueChangesUnsubscribe = () => {};

  constructor(
    private config: FormlyConfig,
    private renderer: Renderer2,
    private _elementRef: ElementRef,
    private hostContainerRef: ViewContainerRef,
    @Optional() private form: FormlyFieldTemplates,
  ) {}

  ngAfterContentInit() {
    this.triggerHook('afterContentInit');
  }

  ngAfterViewInit() {
    this.triggerHook('afterViewInit');
  }

  ngDoCheck() {
    if (this.detectFieldBuild && this.field && this.field.options) {
      this.render();
    }
  }

  ngOnInit() {
    this.triggerHook('onInit');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.triggerHook('onChanges', changes);
  }

  ngOnDestroy() {
    this.resetRefs(this.field);
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hooksObservers.forEach((unsubscribe) => unsubscribe());
    this.valueChangesUnsubscribe();
    this.triggerHook('onDestroy');
  }

  private renderField(containerRef: ViewContainerRef, f: FormlyFieldConfigCache, wrappers: string[] = []) {
    if (this.containerRef === containerRef) {
      this.resetRefs(this.field);
      this.containerRef.clear();
      wrappers = this.field?.wrappers;
    }

    if (wrappers?.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const { component } = this.config.getWrapper(wrapper);

      const ref = containerRef.createComponent<FieldWrapper>(component);
      this.attachComponentRef(ref, f);
      observe<ViewContainerRef & { _lContainer: any }>(
        ref.instance,
        ['fieldComponent'],
        ({ currentValue, previousValue, firstChange }) => {
          if (currentValue) {
            if (previousValue && previousValue._lContainer === currentValue._lContainer) {
              return;
            }

            const viewRef = previousValue ? previousValue.detach() : null;
            if (viewRef && !viewRef.destroyed) {
              currentValue.insert(viewRef);
            } else {
              this.renderField(currentValue, f, wps);
            }

            !firstChange && ref.changeDetectorRef.detectChanges();
          }
        },
      );
    } else if (f?.type) {
      const inlineType = this.form?.templates?.find((ref) => ref.name === f.type);
      let ref: ComponentRef<any> | EmbeddedViewRef<any>;
      if (inlineType) {
        ref = containerRef.createEmbeddedView(inlineType.ref, { $implicit: f });
      } else {
        const { component } = this.config.getType(f.type, true);
        ref = containerRef.createComponent<FieldWrapper>(component);
      }
      this.attachComponentRef(ref, f);
    }
  }

  private triggerHook(name: keyof FormlyHookConfig, changes?: SimpleChanges) {
    if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
      this.valueChangesUnsubscribe = this.fieldChanges(this.field);
    }

    if (this.field?.hooks?.[name]) {
      if (!changes || changes.field) {
        const r = this.field.hooks[name](this.field);
        if (isObservable(r) && ['onInit', 'afterContentInit', 'afterViewInit'].indexOf(name) !== -1) {
          const sub = r.subscribe();
          this.hooksObservers.push(() => sub.unsubscribe());
        }
      }
    }

    if (name === 'onChanges' && changes.field) {
      this.resetRefs(changes.field.previousValue);
      this.render();
    }
  }

  private attachComponentRef<T extends FieldType>(
    ref: ComponentRef<T> | EmbeddedViewRef<T>,
    field: FormlyFieldConfigCache,
  ) {
    this.componentRefs.push(ref);
    field._componentRefs.push(ref);
    if (ref instanceof ComponentRef) {
      Object.assign(ref.instance, { field });
    }
  }

  private render() {
    if (!this.field) {
      return;
    }

    // require Formly build
    if (!this.field.options) {
      this.detectFieldBuild = true;

      return;
    }

    this.detectFieldBuild = false;
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hostObservers = [
      observe<boolean>(this.field, ['hide'], ({ firstChange, currentValue }) => {
        const containerRef = this.containerRef;
        if (this.config.extras.lazyRender === false) {
          firstChange && this.renderField(containerRef, this.field);
          if (!firstChange || (firstChange && currentValue)) {
            this.elementRef &&
              this.renderer.setStyle(this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
          }
        } else {
          if (currentValue) {
            containerRef.clear();
            if (this.field.className) {
              this.renderer.removeAttribute(this.elementRef.nativeElement, 'class');
            }
          } else {
            this.renderField(containerRef, this.field);
            if (this.field.className) {
              this.renderer.setAttribute(this.elementRef.nativeElement, 'class', this.field.className);
            }
          }
        }

        !firstChange && this.field.options.detectChanges(this.field);
      }),
      observe<string>(this.field, ['className'], ({ firstChange, currentValue }) => {
        if (
          (!firstChange || (firstChange && currentValue)) &&
          (!this.config.extras.lazyRender || this.field.hide !== true)
        ) {
          this.elementRef && this.renderer.setAttribute(this.elementRef.nativeElement, 'class', currentValue);
        }
      }),
      ...['touched', 'pristine', 'status'].map((prop) =>
        observe<string>(
          this.field,
          ['formControl', prop],
          ({ firstChange }) => !firstChange && markFieldForCheck(this.field),
        ),
      ),
    ];
  }

  private resetRefs(field: FormlyFieldConfigCache) {
    if (field) {
      if (field._componentRefs) {
        field._componentRefs = field._componentRefs.filter((ref) => this.componentRefs.indexOf(ref) === -1);
      } else {
        defineHiddenProp(this.field, '_componentRefs', []);
      }
    }

    this.componentRefs = [];
  }

  private fieldChanges(field: FormlyFieldConfigCache) {
    this.valueChangesUnsubscribe();
    if (!field) {
      return () => {};
    }

    const subscribes = [
      observeDeep(field, ['templateOptions'], () => field.options.detectChanges(field)),
      observeDeep(field, ['options', 'formState'], () => field.options.detectChanges(field)),
    ];

    for (const path of [['template'], ['fieldGroupClassName'], ['validation', 'show']]) {
      const fieldObserver = observe(
        field,
        path,
        ({ firstChange }) => !firstChange && field.options.detectChanges(field),
      );
      subscribes.push(() => fieldObserver.unsubscribe());
    }

    if (field.formControl && !field.fieldGroup) {
      const control = field.formControl;
      let valueChanges = control.valueChanges.pipe(
        distinctUntilChanged((x, y) => {
          if (x !== y || Array.isArray(x) || isObject(x)) {
            return false;
          }

          return true;
        }),
      );

      if (control.value !== getFieldValue(field)) {
        valueChanges = valueChanges.pipe(startWith(control.value));
      }

      const { updateOn, debounce } = field.modelOptions;
      if ((!updateOn || updateOn === 'change') && debounce?.default > 0) {
        valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
      }

      const sub = valueChanges.subscribe((value) => {
        // workaround for https://github.com/angular/angular/issues/13792
        if (control._fields?.length > 1 && control instanceof FormControl) {
          control.patchValue(value, { emitEvent: false, onlySelf: true });
        }

        field.parsers?.forEach((parserFn) => (value = parserFn(value)));
        if (value !== field.formControl.value) {
          field.formControl.setValue(value);
          return;
        }

        if (hasKey(field)) {
          assignFieldValue(field, value);
        }
        field.options.fieldChanges.next({ value, field, type: 'valueChanges' });
      });

      subscribes.push(() => sub.unsubscribe());
    }

    return () => subscribes.forEach((subscribe) => subscribe());
  }
}
