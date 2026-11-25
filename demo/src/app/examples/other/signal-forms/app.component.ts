import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { map, merge, tap } from 'rxjs';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, JsonPipe],
})
export class AppComponent {
  form = new FormGroup({});
  model = signal({ name: '', age: 25, range: { start: 1, end: 5 } });
  summary = computed(() => `Hello ${this.model().name || '…'}`);

  isRequired = signal(true);
  isDisabled = signal(false);
  isHidden = signal(false);
  events = signal<string[]>([]);

  options: FormlyFormOptions = { signalForms: true };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name' },
      expressions: {
        'props.required': this.isRequired,
        'props.disabled': this.isDisabled,
        hide: this.isHidden,
      },
    },
    {
      key: 'age',
      type: 'input',
      props: { label: 'Age (updates on blur)', type: 'number' },
      modelOptions: { updateOn: 'blur' },
      hooks: {
        onInit: (field) => field.formControl.statusChanges.pipe(tap((status) => this.log(`age status: ${status}`))),
      },
    },
    {
      key: 'range',
      // The group validator reports its error on the `end` control through setErrors().
      validators: {
        endAfterStart: {
          expression: (c: AbstractControl): boolean => c.value.end > c.value.start,
          message: 'End must be greater than start',
          errorPath: 'end',
        },
      },
      fieldGroupClassName: 'row',
      fieldGroup: [
        { key: 'start', type: 'input', className: 'col-6', props: { label: 'Start', type: 'number' } },
        { key: 'end', type: 'input', className: 'col-6', props: { label: 'End', type: 'number' } },
      ],
    },
  ];

  constructor() {
    merge(
      this.form.statusChanges.pipe(map((status) => `form status: ${status}`)),
      this.form.valueChanges.pipe(map(() => 'form value')),
    )
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.log(event));
  }

  control(key: string): AbstractControl {
    return this.form.get(key);
  }

  log(event: string): void {
    this.events.update((events) => [...events, event]);
  }

  toggleRequired(): void {
    this.isRequired.update((v) => !v);
  }

  toggleDisabled(): void {
    this.isDisabled.update((v) => !v);
  }

  toggleHidden(): void {
    this.isHidden.update((v) => !v);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      alert(JSON.stringify(this.model()));
    }
  }
}
