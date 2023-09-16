import { Component, ChangeDetectionStrategy, ViewChild, NgZone, Type, ViewContainerRef } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { take } from 'rxjs/operators';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  multiple?: boolean;
  compareWith?: (o1: any, o2: any) => boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-select',
  template: `
    <ng-template #fieldTypeTemplate>
      <select
        *ngIf="props.multiple; else singleSelect"
        class="form-select"
        multiple
        [formControl]="formControl"
        [compareWith]="props.compareWith"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
        [attr.aria-describedby]="id + '-formly-validation-error'"
        [attr.aria-invalid]="showError"
      >
        <ng-container *ngIf="props.options | formlySelectOptions : field | async as opts">
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
              {{ opt.label }}
            </option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-container>
      </select>

      <ng-template #singleSelect>
        <select
          class="form-select"
          [formControl]="formControl"
          [compareWith]="props.compareWith"
          [class.is-invalid]="showError"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        >
          <option *ngIf="props.placeholder" [ngValue]="undefined">{{ props.placeholder }}</option>
          <ng-container *ngIf="props.options | formlySelectOptions : field | async as opts">
            <ng-container *ngFor="let opt of opts">
              <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
                {{ opt.label }}
              </option>
              <ng-template #optgroup>
                <optgroup [label]="opt.label">
                  <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                    {{ child.label }}
                  </option>
                </optgroup>
              </ng-template>
            </ng-container>
          </ng-container>
        </select>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  override defaultOptions = {
    props: {
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  // workaround for https://github.com/angular/angular/issues/10010
  /**
   * TODO: Check if this is still needed
   */
  @ViewChild(SelectControlValueAccessor) set selectAccessor(s: any) {
    if (!s) {
      return;
    }

    const writeValue = s.writeValue.bind(s);
    if (s._getOptionId(s.value) === null) {
      writeValue(s.value);
    }

    s.writeValue = (value: any) => {
      const id = s._idCounter;
      writeValue(value);
      if (value === null) {
        this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            if (
              id !== s._idCounter &&
              s._getOptionId(value) === null &&
              s._elementRef.nativeElement.selectedIndex !== -1
            ) {
              writeValue(value);
            }
          });
      }
    };
  }

  constructor(private ngZone: NgZone, hostContainerRef: ViewContainerRef) {
    super(hostContainerRef);
  }
}
