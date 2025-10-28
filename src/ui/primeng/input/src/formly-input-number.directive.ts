import { DestroyRef, Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EMPTY } from 'rxjs';

/**
 * Fix PrimeNG p-inputNumber marking control dirty on blur without user input.
 * Import only in your PrimeNG input-number Formly type.
 */
@Directive({
  selector: 'p-inputnumber[formControlName], p-inputnumber[formControl], p-inputnumber[formlyAttributes]',
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
    if (!this.control) return;

    this.initLastValue();
    this.subscribeToChanges();
    this.registerListeners();
  }

  private initLastValue(): void {
    this.lastValue = this.toNumber(this.control.value);
  }

  private subscribeToChanges(): void {
    this.changes$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newValue: unknown) => {
      const newNumericValue = this.toNumber(newValue);
      const isSameValue = this.areEqual(this.lastValue, newNumericValue);

      if (isSameValue && this.control.dirty && !this.userInteracted) {
        this.control.markAsPristine();
      }

      if (this.control.pristine && !isSameValue && this.userInteracted) {
        this.control.markAsDirty();
      }

      this.lastValue = newNumericValue;
    });
  }

  private registerListeners(): void {
    const inputEl = this.el.nativeElement as HTMLInputElement;
    const markAsInteracted = () => (this.userInteracted = true);

    inputEl.addEventListener('input', markAsInteracted);
    inputEl.addEventListener('focus', markAsInteracted);

    this.destroyRef.onDestroy(() => {
      inputEl.removeEventListener('input', markAsInteracted);
      inputEl.removeEventListener('focus', markAsInteracted);
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
    if (a === b) {
      return true;
    }

    if (a == null && b == null) {
      return true;
    }

    return a === b;
  }
}
