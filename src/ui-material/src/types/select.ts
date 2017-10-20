import { Component, OnInit, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { MatSelect } from '@angular/material/select';
import { FormlyErrorStateMatcher } from '../formly.error-state-matcher';

export class SelectOption {
  label: string;
  value?: string;
  group?: SelectOption[];
  disabled?: boolean;

  constructor(label: string, value?: string, children?: SelectOption[]) {
    this.label = label;
    this.value = value;
    this.group = children;
  }
}

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <mat-select [formControl]="formControl" [formlyAttributes]="field" [errorStateMatcher]="errorStateMatcher">
      <ng-container *ngFor="let item of selectOptions">
        <mat-optgroup *ngIf="item.group" label="{{item.label}}">
          <mat-option *ngFor="let child of item.group" [value]="child.value" [disabled]="item.disabled">
            {{ child.label }}
          </mat-option>
        </mat-optgroup>
        <mat-option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</mat-option>
      </ng-container>
    </mat-select>
  `,
})
export class FormlyFieldSelect extends FieldType implements OnInit {
  @ViewChild(MatSelect) matSelect: MatSelect;
  errorStateMatcher = new FormlyErrorStateMatcher(this);

  selectOptions;

  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }

  ngOnInit() {
    if (this.field['__formField__']) {
      this.field['__formField__']._control = this.matSelect;
    }

    let options: SelectOption[] = [];
    this.to.options.map((option: SelectOption) => {
      if (!option[this.groupProp]) {
        options.push(option);
      } else {
        let filteredOption: SelectOption[] = options.filter((filteredOption) => {
          return filteredOption.label === option[this.groupProp];
        });
        if (filteredOption[0]) {
          filteredOption[0].group.push({
            label: option[this.labelProp],
            value: option[this.valueProp],
          });
        }
        else {
          options.push({
            label: option[this.groupProp],
            group: [{ value: option[this.valueProp], label: option[this.labelProp] }],
          });
        }
      }
    });

    this.selectOptions = options;
  }
}
