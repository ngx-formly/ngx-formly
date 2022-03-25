import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Renderer2,
  DoCheck,
  Inject,
  OnDestroy,
} from '@angular/core';
import { FormlyFieldConfig, FormlyFieldConfigCache, FormlyFieldProps } from '../models';
import { defineHiddenProp, FORMLY_VALIDATORS, observe, IObserver } from '../utils';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[formlyAttributes]',
  host: {
    '(change)': 'onHostChange($event)',
  },
})
export class FormlyAttributes implements OnChanges, DoCheck, OnDestroy {
  @Input('formlyAttributes') field: FormlyFieldConfig;
  @Input() id: string;

  private document: Document;
  private uiAttributesCache: any = {};
  private uiAttributes: string[];
  private focusObserver: IObserver<boolean>;

  /**
   * HostBinding doesn't register listeners conditionally which may produce some perf issues.
   *
   * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1991
   */
  private uiEvents = {
    listeners: [] as Function[],
    events: ['click', 'keyup', 'keydown', 'keypress', 'focus', 'blur', 'change'],
    callback: (eventName: string, $event: any) => {
      switch (eventName) {
        case 'focus':
          return this.onFocus($event);
        case 'blur':
          return this.onBlur($event);
        case 'change':
          return this.onChange($event);
        default:
          return this.props[eventName](this.field, $event);
      }
    },
  };

  private get props() {
    return this.field.props || ({} as FormlyFieldProps);
  }

  private get fieldAttrElements(): ElementRef[] {
    return (this.field as FormlyFieldConfigCache)?.['_elementRefs'] || [];
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef, @Inject(DOCUMENT) _document: any) {
    this.document = _document;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field) {
      this.field.name && this.setAttribute('name', this.field.name);
      this.uiEvents.listeners.forEach((listener) => listener());
      this.uiEvents.events.forEach((eventName) => {
        if (this.props?.[eventName] || ['focus', 'blur', 'change'].indexOf(eventName) !== -1) {
          this.uiEvents.listeners.push(
            this.renderer.listen(this.elementRef.nativeElement, eventName, (e) => this.uiEvents.callback(eventName, e)),
          );
        }
      });

      if (this.props?.attributes) {
        observe(this.field, ['props', 'attributes'], ({ currentValue, previousValue }) => {
          if (previousValue) {
            Object.keys(previousValue).forEach((attr) => this.removeAttribute(attr));
          }

          if (currentValue) {
            Object.keys(currentValue).forEach((attr) => {
              if (currentValue[attr] != null) {
                this.setAttribute(attr, currentValue[attr]);
              }
            });
          }
        });
      }

      this.detachElementRef(changes.field.previousValue);
      this.attachElementRef(changes.field.currentValue);
      if (this.fieldAttrElements.length === 1) {
        !this.id && this.field.id && this.setAttribute('id', this.field.id);
        this.focusObserver = observe<boolean>(this.field, ['focus'], ({ currentValue }) => {
          this.toggleFocus(currentValue);
        });
      }
    }

    if (changes.id) {
      this.setAttribute('id', this.id);
    }
  }

  /**
   * We need to re-evaluate all the attributes on every change detection cycle, because
   * by using a HostBinding we run into certain edge cases. This means that whatever logic
   * is in here has to be super lean or we risk seriously damaging or destroying the performance.
   *
   * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
   * Material issue: https://github.com/angular/components/issues/14024
   */
  ngDoCheck() {
    if (!this.uiAttributes) {
      const element = this.elementRef.nativeElement as HTMLElement;
      this.uiAttributes = [...FORMLY_VALIDATORS, 'tabindex', 'placeholder', 'readonly', 'disabled', 'step'].filter(
        (attr) => !element.hasAttribute || !element.hasAttribute(attr),
      );
    }

    this.uiAttributes.forEach((attr) => {
      const value = this.props[attr];
      if (
        this.uiAttributesCache[attr] !== value &&
        (!this.props.attributes || !this.props.attributes.hasOwnProperty(attr.toLowerCase()))
      ) {
        this.uiAttributesCache[attr] = value;
        if (value || value === 0) {
          this.setAttribute(attr, value === true ? attr : `${value}`);
        } else {
          this.removeAttribute(attr);
        }
      }
    });
  }

  ngOnDestroy() {
    this.uiEvents.listeners.forEach((listener) => listener());
    this.detachElementRef(this.field);
    this.focusObserver?.unsubscribe();
  }

  toggleFocus(value: boolean) {
    const element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
    if (!element || !element.nativeElement.focus) {
      return;
    }

    const isFocused =
      !!this.document.activeElement &&
      this.fieldAttrElements.some(
        ({ nativeElement }) =>
          this.document.activeElement === nativeElement || nativeElement.contains(this.document.activeElement),
      );

    if (value && !isFocused) {
      element.nativeElement.focus();
    } else if (!value && isFocused) {
      element.nativeElement.blur();
    }
  }

  onFocus($event: any) {
    this.focusObserver?.setValue(true);
    this.props.focus?.(this.field, $event);
  }

  onBlur($event: any) {
    this.focusObserver?.setValue(false);
    this.props.blur?.(this.field, $event);
  }

  // handle custom `change` event, for regular ones rely on DOM listener
  onHostChange($event: any) {
    if ($event instanceof Event) {
      return;
    }

    this.onChange($event);
  }

  onChange($event: any) {
    this.props.change?.(this.field, $event);
    this.field.formControl?.markAsDirty();
  }

  private attachElementRef(f: FormlyFieldConfigCache) {
    if (!f) {
      return;
    }

    if (f['_elementRefs']?.indexOf(this.elementRef) === -1) {
      f['_elementRefs'].push(this.elementRef);
    } else {
      defineHiddenProp(f, '_elementRefs', [this.elementRef]);
    }
  }

  private detachElementRef(f: FormlyFieldConfigCache) {
    const index = f?.['_elementRefs'] ? this.fieldAttrElements.indexOf(this.elementRef) : -1;
    if (index !== -1) {
      f['_elementRefs'].splice(index, 1);
    }
  }

  private setAttribute(attr: string, value: string) {
    this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
  }

  private removeAttribute(attr: string) {
    this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
  }
}
