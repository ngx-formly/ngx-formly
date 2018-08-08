import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-select',
  template: `
    <select *ngIf="to.multiple; else singleSelect" class="form-control"
      multiple
      [class.custom-select]="to.customSelect"
      [formControl]="formControl"
      [class.is-invalid]="showError"
      [formlyAttributes]="field">
        <ng-container *ngFor="let item of to.options | formlySelectOptions:field | async">
         <optgroup *ngIf="item.group" label="{{item.label}}">
            <option *ngFor="let child of item.group" [value]="child.value" [disabled]="child.disabled">
              {{ child.label }}
            </option>
          </optgroup>
          <option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</option>
        </ng-container>
    </select>

    <ng-template #singleSelect>
      <select class="form-control"
        [formControl]="formControl"
        [class.custom-select]="to.customSelect"
        [class.is-invalid]="showError"
        [formlyAttributes]="field">
        <option *ngIf="to.placeholder" value="">{{ to.placeholder }}</option>
        <ng-container *ngFor="let item of to.options | formlySelectOptions:field | async">
          <optgroup *ngIf="item.group" label="{{item.label}}">
            <option *ngFor="let child of item.group" [value]="child.value" [disabled]="child.disabled">
              {{ child.label }}
            </option>
          </optgroup>
          <option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</option>
        </ng-container>
      </select>
    </ng-template>
  `,
})
export class FormlyFieldSelect extends FieldType {}
