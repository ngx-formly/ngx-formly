import { DestroyRef, Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EMPTY, distinctUntilChanged } from 'rxjs';

/**
 * Directive to fix PrimeNG p-inputNumber marking control dirty on blur without user input.
 *
 * @description
 * PrimeNG's InputNumber component internally normalizes values on blur (e.g., undefined → null),
 * which triggers change events even when the user hasn't interacted with the field.
 * This directive tracks actual user interaction and prevents the control from being
 * incorrectly marked as dirty.
 *
 * @see https://github.com/ngx-formly/ngx-formly/issues/4142
 */
@Directive({
  selector: 'p-inputnumber[formlyAttributes]',
  standalone: true,
})
export class FormlyInputNumberDirective implements OnInit {
  @Input() formlyAttributes?: FormlyFieldConfig;

  private control?: AbstractControl;
  private lastValue: number | null = null;
  private userInteracted = false;

  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private get changes$() {
    return this.control?.valueChanges ?? EMPTY;
  }

  ngOnInit(): void {
    this.control = this.formlyAttributes?.formControl;
    if (!this.control) {
      return;
    }

    this.initLastValue();
    this.subscribeToChanges();
    this.registerListeners();
  }

  private initLastValue(): void {
    this.lastValue = this.toNumber(this.control?.value);
  }

  private subscribeToChanges(): void {
    this.changes$.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((newValue: unknown) => {
      const newNumericValue = this.toNumber(newValue);
      const isSameValue = this.areEqual(this.lastValue, newNumericValue);

      if (isSameValue && this.control.dirty && !this.userInteracted) {
        this.control.markAsPristine();
        console.log('Control marked as pristine due to no user interaction');
      }

      this.lastValue = newNumericValue;
    });
  }

  private registerListeners(): void {
    const inputEl = this.el.nativeElement as HTMLInputElement;

    const markAsInteracted = () => (this.userInteracted = true);

    const resetInteraction = () => {
      this.lastValue = this.toNumber(this.control?.value);
      this.userInteracted = false;
    };

    inputEl.addEventListener('input', markAsInteracted);
    inputEl.addEventListener('focus', resetInteraction);

    this.destroyRef.onDestroy(() => {
      inputEl.removeEventListener('input', markAsInteracted);
      inputEl.removeEventListener('focus', resetInteraction);
    });
  }

  private toNumber(value: unknown): number | null {
    if (value == null || value === '') {
      return null;
    }

    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }

  private areEqual(a: number | null, b: number | null): boolean {
    return a === b || (a == null && b == null);
  }
}
