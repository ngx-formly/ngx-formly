import { Field } from './field';
import { OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, AfterViewChecked, Renderer, ElementRef } from '@angular/core';

export abstract class FieldType extends Field implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  private _renderer: Renderer;
  private _elementRef: ElementRef;
  private attrbites = ['placeholder', 'tabindex', 'step'];
  constructor(renderer: Renderer, elementRef: ElementRef) {
    super();
    this._renderer = renderer;
    this._elementRef = elementRef;
  }
  private get lifecycle() {
    return this.field.lifecycle;
  }
  ngOnInit() {
    this.lifeCycleHooks('onInit');
  }

  ngOnChanges(changes) {
    this.lifeCycleHooks('onChanges');
  }

  ngDoCheck() {
    this.lifeCycleHooks('doCheck');
  }

  ngAfterContentInit() {
    this.lifeCycleHooks('afterContentInit');
  }

  ngAfterContentChecked() {
    this.lifeCycleHooks('afterContentChecked');
  }

  ngAfterViewInit() {
    const input = this._elementRef.nativeElement.querySelectorAll('input,select,textarea');
    this.attrbites.filter(attribute => this.field.templateOptions[attribute] !== '' || this.field.templateOptions[attribute] !== undefined)
      .map(attribute => {
        this._renderer.setElementAttribute(input[0], attribute, this.field.templateOptions[attribute]);
      });
    this.lifeCycleHooks('afterViewInit');
  }

  ngAfterViewChecked() {
    this.lifeCycleHooks('afterViewChecked');
  }

  ngOnDestroy() {
    this.lifeCycleHooks('onDestroy');
  }

  private lifeCycleHooks(type) {
    if (this.lifecycle && this.lifecycle[type]) {
      this.lifecycle[type].bind(this)();
    }
  }
}
