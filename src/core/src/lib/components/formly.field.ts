import {
  Component,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  SimpleChanges,
  ComponentFactoryResolver,
  OnInit,
  OnChanges,
  OnDestroy,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  Injector,
} from '@angular/core';
import { FormlyConfig } from '../services/formly.config';
import { FormlyFieldConfig, FormlyFieldConfigCache } from '../models';
import { defineHiddenProp, assignFieldValue, observe } from '../utils';
import { FieldWrapper } from '../templates/field.wrapper';
import { FieldType } from '../templates/field.type';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'formly-field',
  template: `
    <ng-template #container></ng-template>
  `,
  host: {
    '[style.display]': 'field.hide ? "none":""',
    '[class]': 'field.className? field.className : className',
  },
})
export class FormlyField
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  @Input() field: FormlyFieldConfig;
  @Input('class') className = '';

  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;

  valueChangesUnsubscribe = () => {};
  constructor(private config: FormlyConfig, private resolver: ComponentFactoryResolver, private injector: Injector) {}

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
      const { component } = this.config.getWrapper(wrapper);
      const resolver =
        f.options && f.options._componentFactoryResolver ? f.options._componentFactoryResolver : this.resolver;

      const ref = resolver.resolveComponentFactory<FieldWrapper>(component).create(containerRef.injector);
      this.attachComponentRef(containerRef, ref, f);
      observe(ref.instance, ['fieldComponent'], ({ currentValue, firstChange }) => {
        if (currentValue) {
          this.renderField(currentValue as ViewContainerRef, f, wps);
          !firstChange && ref.changeDetectorRef.detectChanges();
        }
      });
    } else {
      const ref = this.config.createComponent(f, this.resolver, this.injector);
      if (ref) {
        this.attachComponentRef(containerRef, ref, f);
      }
    }
  }

  private triggerHook(name: string, changes?: SimpleChanges) {
    if (this.field.hooks && this.field.hooks[name]) {
      if (!changes || changes.field) {
        this.field.hooks[name](this.field);
      }
    }

    if (name === 'onChanges' && changes.field) {
      this.renderField(this.containerRef, this.field, this.field.wrappers);
    }

    if (name === 'onInit' || (name === 'onChanges' && changes.field && !changes.field.firstChange)) {
      this.valueChangesUnsubscribe = this.valueChanges(this.field);
    }
  }

  private attachComponentRef<T extends FieldType>(
    containerRef: ViewContainerRef,
    ref: ComponentRef<T>,
    field: FormlyFieldConfigCache,
  ) {
    field._componentRefs.push(ref);
    Object.assign(ref.instance, { field });
    containerRef.insert(ref.hostView);
  }

  private valueChanges(field: FormlyFieldConfigCache) {
    this.valueChangesUnsubscribe();
    if (field.key && field.type && !field.fieldGroup) {
      const control = field.formControl;
      let valueChanges = control.valueChanges;

      const { updateOn, debounce } = field.modelOptions;
      if ((!updateOn || updateOn === 'change') && debounce && debounce.default > 0) {
        valueChanges = control.valueChanges.pipe(debounceTime(debounce.default));
      }

      const sub = valueChanges.subscribe(value => {
        // workaround for https://github.com/angular/angular/issues/13792
        if ((control as any)._onChange.length > 1) {
          control.setValue(value, { emitEvent: false });
        }

        if (field.parsers && field.parsers.length > 0) {
          field.parsers.forEach(parserFn => (value = parserFn(value)));
        }

        assignFieldValue(field, value);
        field.options.fieldChanges.next({ value, field, type: 'valueChanges' });
      });

      return () => sub.unsubscribe();
    }

    return () => {};
  }
}
