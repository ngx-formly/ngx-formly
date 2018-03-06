import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
  selector: 'formly-field-select',
  template: `
    <select *ngIf="to.multiple; else singleSelect" class="form-control"
      [formControl]="formControl"
      [class.is-invalid]="showError"
      [multiple]="true"
      [formlyAttributes]="field">
        <ng-container *ngFor="let item of selectOptions | async">
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
        <ng-container *ngFor="let item of selectOptions | async">
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

  get selectOptions(): Observable<any[]> {
    if (!(this.to.options instanceof Observable)) {
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

      return of(options);
    } else {
      // return observable directly
      return this.to.options;
    }
  }
}
