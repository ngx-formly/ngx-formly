import { Field } from './field';
import { OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy, AfterViewChecked, SimpleChanges } from '@angular/core';
import { FormlyLifeCycleOptions, FormlyLifeCycleFn } from './../components/formly.field.config';

export abstract class FieldType extends Field implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  ngOnInit() {
    this.lifeCycleHooks(this.lifecycle.onInit);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lifeCycleHooks(this.lifecycle.onChanges);
  }

  ngDoCheck() {
    this.lifeCycleHooks(this.lifecycle.doCheck);
  }

  ngAfterContentInit() {
    this.lifeCycleHooks(this.lifecycle.afterContentInit);
  }

  ngAfterContentChecked() {
    this.lifeCycleHooks(this.lifecycle.afterContentChecked);
  }

  ngAfterViewInit() {
    this.lifeCycleHooks(this.lifecycle.afterViewInit);
  }

  ngAfterViewChecked() {
    this.lifeCycleHooks(this.lifecycle.afterViewChecked);
  }

  ngOnDestroy() {
    this.lifeCycleHooks(this.lifecycle.onDestroy);
  }

  private get lifecycle(): FormlyLifeCycleOptions {
    return this.field.lifecycle || {};
  }

  private lifeCycleHooks(callback: FormlyLifeCycleFn) {
    if (callback) {
      callback.bind(this)(this.form, this.field, this.model, this.options);
    }
  }
}
