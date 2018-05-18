import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-select',
  template: `
    <select *ngIf="to.multiple; else singleSelect" class="form-control"
      [formControl]="formControl"
      [class.is-invalid]="showError"
      [multiple]="true"
      [formlyAttributes]="field">
        <ng-container *ngFor="let item of to.options | formlySelectOptions:groupProp | async">
         <optgroup *ngIf="item.group" label="{{item.label}}">
            <option *ngFor="let child of item.group" [value]="child[valueProp]" [disabled]="child.disabled">
              {{ child[labelProp] }}
            </option>
          </optgroup>
          <option *ngIf="!item.group" [value]="item[valueProp]" [disabled]="item.disabled">{{ item[labelProp] }}</option>
        </ng-container>
    </select>

    <ng-template #singleSelect>
      <select class="form-control"
        [formControl]="formControl"
        [class.is-invalid]="showError"
        [formlyAttributes]="field">
        <option *ngIf="to.placeholder" value="">{{ to.placeholder }}</option>
        <ng-container *ngFor="let item of to.options | formlySelectOptions:groupProp | async">
          <optgroup *ngIf="item.group" label="{{item.label}}">
            <option *ngFor="let child of item.group" [value]="child[valueProp]" [disabled]="child.disabled">
              {{ child[labelProp] }}
            </option>
          </optgroup>
          <option *ngIf="!item.group" [value]="item[valueProp]" [disabled]="item.disabled">{{ item[labelProp] }}</option>
        </ng-container>
      </select>
    </ng-template>
  `,
})
export class FormlyFieldSelect extends FieldType {
  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }
}
