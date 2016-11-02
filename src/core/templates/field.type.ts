import { Field } from './field';
import { OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';

export abstract class FieldType extends Field implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
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
    this.lifeCycleHooks('afterViewInit');
  }

  ngAfterViewChecked() {
    this.lifeCycleHooks('afterViewChecked');
  }

  ngOnDestroy() {
    this.lifeCycleHooks('onDestroy');
  }

  private get lifecycle() {
    return this.field.lifecycle;
  }

  private lifeCycleHooks(type) {
    if (this.lifecycle && this.lifecycle[type]) {
      this.lifecycle[type].bind(this)();
    }
  }
}
