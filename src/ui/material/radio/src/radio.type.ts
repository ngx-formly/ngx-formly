import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnDestroy, Type } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig, ɵobserve as observe } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/material/form-field';
import { MatRadioGroup } from '@angular/material/radio';

interface RadioProps extends FormlyFieldProps {
  labelPosition?: 'before' | 'after';
}

export interface FormlyRadioFieldConfig extends FormlyFieldConfig<RadioProps> {
  type: 'radio' | Type<FormlyFieldRadio>;
}

@Component({
  selector: 'formly-field-mat-radio',
  template: `
    <mat-radio-group
      [formControl]="formControl"
      [formlyAttributes]="field"
      [required]="required"
      [tabindex]="props.tabindex"
      [attr.aria-label]="props.label"
    >
      @for (option of props.options | formlySelectOptions: field | async; track $index; let i = $index) {
        <mat-radio-button
          [id]="id + '_' + i"
          [color]="props.color"
          [labelPosition]="props.labelPosition"
          [disabled]="option.disabled"
          [value]="option.value"
        >
          {{ option.label }}
        </mat-radio-button>
      }
    </mat-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldRadio extends FieldType<FieldTypeConfig<RadioProps>> implements AfterViewInit, OnDestroy {
  @ViewChild(MatRadioGroup, { static: true }) radioGroup!: MatRadioGroup;
  override defaultOptions = {
    props: {
      hideFieldUnderline: true,
      floatLabel: 'always' as const,
      tabindex: -1,
    },
  };

  private focusObserver!: ReturnType<typeof observe>;
  ngAfterViewInit() {
    this.focusObserver = observe(this.field, ['focus'], ({ currentValue }) => {
      if (this.props.tabindex === -1 && currentValue && this.radioGroup._radios.length > 0) {
        // https://github.com/ngx-formly/ngx-formly/issues/2498
        setTimeout(() => {
          const radio = this.radioGroup.selected ? this.radioGroup.selected : this.radioGroup._radios.first;
          radio.focus();
        });
      }
    });
  }

  // TODO: find a solution to prevent scroll on focus
  override onContainerClick() {}

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.focusObserver && this.focusObserver.unsubscribe();
  }
}
