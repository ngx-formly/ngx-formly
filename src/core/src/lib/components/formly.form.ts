import {
  Component,
  ChangeDetectionStrategy,
  DoCheck,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  NgZone,
  ContentChildren,
  QueryList,
  DestroyRef,
  PendingTasks,
  inject,
  Injector,
  WritableSignal,
  EffectRef,
  untracked,
  effect,
  isWritableSignal,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyFieldConfigCache, FormlyValueChangeEvent } from '../models';
import { FormlyFormBuilder } from '../services/formly.builder';
import { FormlyConfig } from '../services/formly.config';
import { clone, defineHiddenProp, hasKey, isEqualValue, isNoopNgZone, isSignalRequired, observeDeep } from '../utils';
import { switchMap, filter, take, tap } from 'rxjs/operators';
import { clearControl } from '../extensions/field-form/utils';
import { FormlyFieldTemplates, FormlyTemplate, LegacyFormlyTemplate } from './formly.template';
import { of, Subscription } from 'rxjs';
import { FormlyField } from './formly.field';

/**
 * The `<form-form>` component is the main container of the form,
 * which takes care of managing the form state
 * and delegates the rendering of each field to `<formly-field>` component.
 */
@Component({
  selector: 'formly-form',
  template: '<formly-field [field]="field"></formly-field>',
  providers: [FormlyFormBuilder, FormlyFieldTemplates],
  standalone: true,
  imports: [FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyForm implements DoCheck, OnChanges, OnDestroy {
  /** The form instance which allow to track model value and validation status. */
  @Input()
  set form(form: UntypedFormGroup | UntypedFormArray) {
    this.field.form = form;
  }
  get form(): UntypedFormGroup | UntypedFormArray {
    return this.field.form;
  }

  /**
   * The model to be represented by the form.
   * The form sets a `WritableSignal` to a copy of the model after each change.
   */
  @Input()
  set model(model: any) {
    this.modelSignalEffect?.destroy();
    this.modelSignal = undefined;
    if (isWritableSignal(model)) {
      this.bindModelSignal(model);
      return;
    }
    if (this.config.extras.immutable && this._modelChangeValue === model) {
      return;
    }

    this.setField({ model });
  }
  get model(): any {
    return this.field.model;
  }

  /** The field configurations for building the form. */
  @Input()
  set fields(fieldGroup: FormlyFieldConfig[]) {
    this.setField({ fieldGroup });
  }
  get fields(): FormlyFieldConfig[] {
    return this.field.fieldGroup;
  }

  /** Options for the form. */
  @Input()
  set options(options: FormlyFormOptions) {
    this.setField({ options });
  }
  get options(): FormlyFormOptions {
    return this.field.options;
  }

  /** Event that is emitted when the model value is changed */
  @Output() modelChange = new EventEmitter<any>();
  /** Emits a build event asynchronously when the fields or form input changes. */
  @Output() fieldChange = new EventEmitter<FormlyValueChangeEvent>();
  @ContentChildren(FormlyTemplate) set templates(templates: QueryList<FormlyTemplate>) {
    this.fieldTemplates.templates = templates;
  }

  field: FormlyFieldConfigCache = { type: 'formly-group' };
  private readonly destroyRef = inject(DestroyRef);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly injector = inject(Injector);
  private _modelChangeValue: any = {};
  private modelSignal?: WritableSignal<any>;
  private modelSignalValue: any;
  private modelSignalEffect?: EffectRef;
  private valueChangesUnsubscribe = () => {};
  private readonly afterBuild = () => {
    if (this.modelSignal) {
      this.syncModelSignal(this.modelSignal);
    }
  };

  constructor(
    private builder: FormlyFormBuilder,
    private config: FormlyConfig,
    private ngZone: NgZone,
    protected fieldTemplates: FormlyFieldTemplates,
  ) {}

  ngDoCheck() {
    if (this.config.extras.checkExpressionOn === 'changeDetectionCheck') {
      this.checkExpressionChange();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields && this.form) {
      clearControl(this.form);
    }

    if (changes.fields || changes.form || (changes.model && this._modelChangeValue !== changes.model.currentValue)) {
      this.build();
    }

    if (changes.fields || changes.form) {
      this.pendingTasks.run(async () => {
        await Promise.resolve();
        if (!this.destroyRef.destroyed) {
          this.fieldChange.emit({ field: this.field, type: 'build', value: this.form });
        }
      });
    }
  }

  ngOnDestroy() {
    this.valueChangesUnsubscribe();
    this.config.clearRefs();
    if (this.field.options?._afterBuild === this.afterBuild) {
      delete this.field.options._afterBuild;
    }
  }

  private checkExpressionChange() {
    this.field.options.checkExpressions?.(this.field);
  }

  private valueChanges() {
    this.valueChangesUnsubscribe();

    let formEvents: Subscription | null = null;
    if (isSignalRequired()) {
      let submitted = this.options?.parentForm?.submitted;
      formEvents = (this.form as any).events.subscribe(() => {
        if (submitted !== this.options?.parentForm?.submitted) {
          this.options.detectChanges(this.field);
          submitted = this.options?.parentForm?.submitted;
        }
      });
    }

    const fieldChangesDetection: any[] = [
      observeDeep(this.field.options, ['formState'], () => this.field.options.detectChanges(this.field)),
    ];
    const valueChanges = this.field.options.fieldChanges
      .pipe(
        filter(({ field, type }) => hasKey(field) && type === 'valueChanges'),
        // keep the signal current for expressions and host code that run before the zone is stable
        tap(() => {
          if (this.modelSignal) {
            this.syncModelSignal(this.modelSignal);
          }
        }),
        switchMap(() => (isNoopNgZone(this.ngZone) ? of(null) : this.ngZone.onStable.asObservable().pipe(take(1)))),
      )
      .subscribe(() =>
        this.ngZone.runGuarded(() => {
          // runGuarded is used to keep in sync the expression changes
          // https://github.com/ngx-formly/ngx-formly/issues/2095
          this.checkExpressionChange();
          this._modelChangeValue = clone(this.model);
          if (this.modelSignal) {
            this.syncModelSignal(this.modelSignal, this._modelChangeValue);
          }
          this.modelChange.emit(this._modelChangeValue);
        }),
      );

    return () => {
      fieldChangesDetection.forEach((fnc) => fnc());
      formEvents?.unsubscribe();
      valueChanges.unsubscribe();
    };
  }

  private setField(field: FormlyFieldConfigCache) {
    if (this.config.extras.immutable) {
      this.field = { ...this.field, ...clone(field) };
    } else {
      Object.keys(field).forEach((p) => ((this.field as any)[p] = (field as any)[p]));
    }
  }

  private build() {
    this.valueChangesUnsubscribe();
    if (this.modelSignal) {
      defineHiddenProp((this.field.options ??= {}), '_afterBuild', this.afterBuild);
    }
    this.builder.build(this.field);
    this.valueChangesUnsubscribe = this.valueChanges();
  }

  private bindModelSignal(model: WritableSignal<any>) {
    this.modelSignal = model;
    this.modelSignalValue = model();
    this.useSignalValue(this.modelSignalValue);
    this.modelSignalEffect = effect(
      () => {
        const value = model();
        if (value === this.modelSignalValue) {
          return;
        }
        this.modelSignalValue = value;
        untracked(() => {
          this.useSignalValue(value);
          this.build();
        });
      },
      { injector: this.injector },
    );
  }

  private syncModelSignal(modelSignal: WritableSignal<any>, copy?: any) {
    const current = untracked(modelSignal);

    if (current !== this.modelSignalValue || isEqualValue(this.model, current ?? {})) {
      return;
    }

    modelSignal.set(copy ?? clone(this.model));
    // a signal with a custom `equal` can keep its previous value
    this.modelSignalValue = untracked(modelSignal);
  }

  // Formly mutates the root model, so bind a copy and leave the host's object untouched.
  private useSignalValue(model: any) {
    this.setField({ model: this.config.extras.immutable ? model : clone(model) });
  }
}

@Component({
  selector: 'formly-form',
  template: '<formly-field [field]="field"></formly-field>',
  providers: [FormlyFormBuilder, FormlyFieldTemplates],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LegacyFormlyForm extends FormlyForm {
  @ContentChildren(LegacyFormlyTemplate) override set templates(templates: QueryList<FormlyTemplate>) {
    this.fieldTemplates.templates = templates;
  }
}
