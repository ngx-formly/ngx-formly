import {
  Component, Input,
  ViewContainerRef, ViewChild, ComponentRef, SimpleChanges, ComponentFactoryResolver,
  OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, Renderer2, ElementRef,
} from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFieldConfigCache } from './formly.field.config';
import { defineHiddenProp, wrapProperty } from '../utils';
import { FieldWrapper } from '../templates/field.wrapper';
import { FieldType } from '../templates/field.type';
import { isObservable } from 'rxjs';

@Component({
  selector: 'formly-field',
  template: `<ng-template #container></ng-template>`,
})
export class FormlyField implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() field: FormlyFieldConfig;

  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;
  private hostObservers: Function[] = [];
  private componentRefs: any[] = [];
  private hooksObservers: Function[] = [];
  private detectFieldBuild = false;

  constructor(
    private formlyConfig: FormlyConfig,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
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
    if (this.detectFieldBuild && (this.field && this.field.options)) {
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
    this.hostObservers.forEach(unsubscribe => unsubscribe());
    this.hooksObservers.forEach(unsubscribe => unsubscribe());
    this.triggerHook('onDestroy');
  }

  private renderField(containerRef: ViewContainerRef, f: FormlyFieldConfigCache, wrappers: string[] = []) {
    if (this.containerRef === containerRef) {
      this.resetRefs(this.field);
      this.containerRef.clear();
      wrappers = this.field ? this.field.wrappers : [];
    }

    if (wrappers && wrappers.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const { component } = this.formlyConfig.getWrapper(wrapper);

      const ref = containerRef.createComponent<FieldWrapper>(this.resolver.resolveComponentFactory(component));
      this.attachComponentRef(ref, f);
      wrapProperty<ViewContainerRef>(ref.instance, 'fieldComponent', ({ firstChange, previousValue, currentValue }) => {
        if (currentValue) {
          if (previousValue && previousValue['_lContainer'] === currentValue['_lContainer']) {
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
      });
    } else if (f && f.type) {
      const { component } = this.formlyConfig.getType(f.type);
      const ref = containerRef.createComponent<FieldWrapper>(this.resolver.resolveComponentFactory(component));
      this.attachComponentRef(ref, f);
    }
  }

  private triggerHook(name: string, changes?: SimpleChanges) {
    if (this.field && this.field.hooks && this.field.hooks[name]) {
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

  private attachComponentRef<T extends FieldType>(ref: ComponentRef<T>, field: FormlyFieldConfigCache) {
    this.componentRefs.push(ref);
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
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
    this.hostObservers.forEach(unsubscribe => unsubscribe());
    this.hostObservers = [
      wrapProperty(this.field, 'hide', ({ firstChange, currentValue }) => {
        if (!this.formlyConfig.extras.lazyRender) {
          firstChange && this.renderField(this.containerRef, this.field);
          if (!firstChange || (firstChange && currentValue)) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', currentValue ? 'none' : '');
          }
        } else {
          if (currentValue) {
            this.containerRef.clear();
            if (this.field.className) {
              this.renderer.removeAttribute(this.elementRef.nativeElement, 'class');
            }
          } else {
            this.renderField(this.containerRef, this.field);
            if (this.field.className) {
              this.renderer.setAttribute(this.elementRef.nativeElement, 'class', this.field.className);
            }
          }
        }
      }),
      wrapProperty(this.field, 'className', ({ firstChange, currentValue }) => {
        if (
          (!firstChange || (firstChange && currentValue))
          && (!this.formlyConfig.extras.lazyRender || (this.field.hide !== true))
        ) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'class', currentValue);
        }
      }),
    ];
  }

  private resetRefs(field: FormlyFieldConfigCache) {
    if (field) {
      if (field._componentRefs) {
        field._componentRefs = field._componentRefs.filter(ref => this.componentRefs.indexOf(ref) === -1);
      } else {
        defineHiddenProp(this.field, '_componentRefs', []);
      }
    }

    this.componentRefs = [];
  }
}
