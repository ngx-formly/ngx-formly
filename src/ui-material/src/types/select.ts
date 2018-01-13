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
    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [multiple]="to.multiple"
      (selectionChange)="to.change ? to.change(field, formControl):''"
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
  @ViewChild(MatSelect) matSelect: MatSelect;
  errorStateMatcher = new FormlyErrorStateMatcher(this);

  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }

  private _selectOptions: SelectOption[] = [];
  private _oldOptions: SelectOption[] = [];
  get selectOptions() {
    if (this.to.options.length === this._oldOptions.length
      && this._oldOptions.every(opt => !!this.to.options.find(o => o[this.valueProp] === opt[this.valueProp]))
    ) {
      return this._selectOptions;
    }

    this._oldOptions = [...this.to.options];
    this._selectOptions = [];
    const groups: { [key: string]: SelectOption[] } = {};
    this.to.options.map((option: SelectOption) => {
      if (!option[this.groupProp]) {
        this._selectOptions.push(option);
      } else {
        if (groups[option[this.groupProp]]) {
          groups[option[this.groupProp]].push(option);
        } else {
          groups[option[this.groupProp]] = [option];
          this._selectOptions.push({
            label: option[this.groupProp],
            group: groups[option[this.groupProp]],
          });
        }
      }
    });

    return this._selectOptions;
  }

  ngOnInit() {
    if (this.field['__formField__']) {
      this.field['__formField__']._control = this.matSelect;
    }
    super.ngOnInit();
  }
}
