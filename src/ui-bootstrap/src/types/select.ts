import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

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
  selector: 'formly-field-select',
  template: `
    <select [formControl]="formControl" class="form-control" [class.is-invalid]="showError" [formlyAttributes]="field">
      <option value="">{{ to.placeholder }}</option>
      <ng-container *ngFor="let item of selectOptions">
       <optgroup *ngIf="item.group" label="{{item.label}}">
         <option *ngFor="let child of item.group" [value]="child.value" [disabled]="item.disabled">
           {{ child.label }}
         </option>
       </optgroup>
       <option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</option>
      </ng-container>
    </select>
  `,
})
export class FormlyFieldSelect extends FieldType {
  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }

  get selectOptions() {
    let options: SelectOption[] = [];
    this.to.options.map((option: SelectOption) => {
      option = { label: option[this.labelProp], value: option[this.valueProp] };

      if (!option[this.groupProp]) {
        options.push(option);
      } else {
        let filteredOption: SelectOption[] = options.filter((filteredOption) => {
          return filteredOption.label === option[this.groupProp];
        });
        if (filteredOption[0]) {
          filteredOption[0].group.push(option);
        }
        else {
          options.push({
            label: option[this.groupProp],
            group: [option],
          });
        }
      }
    });
    return options;
  }
}
