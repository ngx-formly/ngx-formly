import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'formly-field-mat-native-select',
  template: `
    <select
      matNativeControl
      [id]="id"
      [readonly]="to.readonly"
      [required]="to.required"
      [errorStateMatcher]="errorStateMatcher"
      [formControl]="formControl"
      [formlyAttributes]="field"
    >
      <option *ngIf="to.placeholder" [ngValue]="undefined">{{ to.placeholder }}</option>
      <ng-container *ngIf="to.options | formlySelectOptions: field | async as opts">
        <ng-container *ngIf="to._flatOptions; else grouplist">
          <ng-container *ngFor="let opt of opts">
            <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
          </ng-container>
        </ng-container>

        <ng-template #grouplist>
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">{{
              opt.label
            }}</option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-template>
      </ng-container>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldNativeSelect extends FieldType {
  @ViewChild(MatInput, { static: true }) formFieldControl!: MatInput;
  defaultOptions = {
    templateOptions: {
      options: [],
    },
  };
}
