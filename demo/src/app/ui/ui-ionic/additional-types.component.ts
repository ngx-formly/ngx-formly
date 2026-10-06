import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfigOption, FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FormlySelectOptionsPipe } from '@ngx-formly/core/select';
import { Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'formly-field-ion-native-select',
  imports: [AsyncPipe, ReactiveFormsModule, IonicModule, FormlyModule, FormlySelectOptionsPipe],
  template: `
    @if (!props.hideLabel) {
      <label [for]="id">{{ props.label }}{{ props.required && !props.hideRequiredMarker ? ' *' : '' }}</label>
    }
    <select [formControl]="formControl" [formlyAttributes]="field">
      <option [ngValue]="undefined">{{ props.placeholder }}</option>
      @for (option of props.options | formlySelectOptions: field | async; track option.value) {
        <option [ngValue]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
      }
    </select>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
      }
      select {
        flex: 1;
        min-width: 0;
        padding: 12px 0;
        color: var(--ion-text-color);
        background: transparent;
        border: 0;
      }
    `,
  ],
})
export class NativeSelectTypeComponent extends FieldType<FieldTypeConfig> {}

@Component({
  selector: 'formly-field-ion-autocomplete',
  imports: [AsyncPipe, ReactiveFormsModule, IonicModule, FormlyModule],
  template: `
    @if (!props.hideLabel) {
      <ion-label [id]="id + '-label'"
        >{{ props.label }}{{ props.required && !props.hideRequiredMarker ? ' *' : '' }}</ion-label
      >
    }
    @let options = (suggestions | async) ?? [];
    <ion-searchbar
      [formControl]="formControl"
      [placeholder]="props.placeholder"
      [attr.aria-label]="props.label"
      role="combobox"
      aria-autocomplete="list"
      [attr.aria-expanded]="open && options.length > 0"
      [attr.aria-controls]="id + '-options'"
      [attr.aria-activedescendant]="open && activeIndex >= 0 ? id + '-option-' + activeIndex : null"
      (ionFocus)="open = true"
      (ionBlur)="open = false"
      (ionInput)="open = true; activeIndex = -1"
      (keydown)="onKeydown($event, options)"
    />
    @if (open && options.length > 0 && !formControl.disabled) {
      <ion-list [id]="id + '-options'" role="listbox" [attr.aria-label]="props.label">
        @for (option of options; track option; let index = $index) {
          <ion-item
            [button]="true"
            [detail]="false"
            role="option"
            [id]="id + '-option-' + index"
            [attr.aria-selected]="activeIndex === index"
            [color]="activeIndex === index ? 'light' : undefined"
            (pointerdown)="$event.preventDefault()"
            (click)="select(option)"
          >
            <ion-label>{{ option }}</ion-label>
          </ion-item>
        }
      </ion-list>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        padding: 12px 0;
      }
      ion-searchbar {
        padding: 8px 0 0;
      }
      ion-list {
        max-height: 240px;
        overflow-y: auto;
      }
    `,
  ],
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> implements OnInit {
  suggestions: Observable<string[]>;
  open = false;
  activeIndex = -1;

  ngOnInit() {
    this.suggestions = this.formControl.valueChanges.pipe(
      startWith(this.formControl.value ?? ''),
      switchMap((term): Observable<string[]> => this.props.filter(term ?? '')),
    );
  }

  select(option: string) {
    this.formControl.setValue(option);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.open = false;
    this.activeIndex = -1;
  }

  onKeydown(event: KeyboardEvent, options: string[]) {
    if (event.key === 'Escape') {
      this.open = false;
    } else if (['ArrowDown', 'ArrowUp'].includes(event.key) && options.length) {
      event.preventDefault();
      this.open = true;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex =
        this.activeIndex < 0
          ? direction === 1
            ? 0
            : options.length - 1
          : (this.activeIndex + direction + options.length) % options.length;
    } else if (event.key === 'Enter' && this.open && this.activeIndex >= 0) {
      event.preventDefault();
      this.select(options[this.activeIndex]);
    }
  }
}

export const additionalTypes: ConfigOption = {
  types: [
    { name: 'native-select', component: NativeSelectTypeComponent, wrappers: ['form-field'] },
    { name: 'datepicker', extends: 'datetime', defaultOptions: { props: { presentation: 'date' } } },
    { name: 'autocomplete', component: AutocompleteTypeComponent, wrappers: ['form-field'] },
  ],
};
