import { Component } from '@angular/core';
import { FieldType } from '../../core/core';

export class SelectOption {
  label: string;
  value?: string;
  group?: SelectOption[];

  constructor(label: string, value?: string, children?: SelectOption[]) {
    this.label = label;
    this.value = value;
    this.group = children;
  }
}


@Component({
  selector: 'formly-field-select',
  template: `
    <select [formControl]="formControl" class="form-control" [formlyAttributes]="field">
      <option value="" *ngIf="to.placeholder">{{to.placeholder}}</option>
      <template ngFor let-item [ngForOf]="selectOptions">
       <optgroup *ngIf="item.group" label="{{item.label}}">
         <option *ngFor="let child of item.group" [value]="child.value">
           {{child.label}}
         </option>
       </optgroup>
       <option *ngIf="!item.group" [value]="item.value">{{item.label}}</option>
    </template>
    </select>
  `,
})
export class FormlyFieldSelect extends FieldType {
  get labelProp(): string { return this.to['labelProp'] || 'label'; }
  get valueProp(): string { return this.to['valueProp'] || 'value'; }
  get groupProp(): string { return this.to['groupProp'] || 'group'; }

  get selectOptions() {
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
    return options;
  }
}
