import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FieldType } from './field';

export class SelectOption {
  label: string;
  value?: string;
  group?: SelectOption[];
  disabled?: boolean;
  [key: string]: any;

  constructor(label: string, value?: string, children?: SelectOption[]) {
    this.label = label;
    this.value = value;
    this.group = children;
  }
}

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [multiple]="to.multiple"
      (selectionChange)="to.change && to.change(field, formControl)"
      [errorStateMatcher]="errorStateMatcher">
      <ng-container *ngFor="let item of selectOptions">
        <mat-optgroup *ngIf="item.group" label="{{item.label}}">
          <mat-option *ngFor="let child of item.group" [value]="child[valueProp]" [disabled]="child.disabled">
            {{ child[labelProp] }}
          </mat-option>
        </mat-optgroup>
        <mat-option *ngIf="!item.group" [value]="item[valueProp]" [disabled]="item.disabled">{{ item[labelProp] }}</mat-option>
      </ng-container>
    </mat-select>
  `,
})
export class FormlyFieldSelect extends FieldType implements OnInit {
  @ViewChild(MatSelect) formFieldControl: MatSelect;

  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }

  get selectOptions() {
    const options: SelectOption[] = [],
      groups: { [key: string]: SelectOption[] } = {};

    this.to.options.map((option: SelectOption) => {
      if (!option[this.groupProp]) {
        options.push(option);
      } else {
        if (groups[option[this.groupProp]]) {
          groups[option[this.groupProp]].push(option);
        } else {
          groups[option[this.groupProp]] = [option];
          options.push({
            label: option[this.groupProp],
            group: groups[option[this.groupProp]],
          });
        }
      }
    });

    return options;
  }
}
