import { Component, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-select',
  template: `
    <select *ngIf="to.multiple; else singleSelect" class="form-control"
      multiple
      [class.custom-select]="to.customSelect"
      [formControl]="formControl"
      [compareWith]="to.compareWith || compareWith"
      [class.is-invalid]="showError"
      [formlyAttributes]="field">
      <ng-container *ngIf="to.options | formlySelectOptions:field | async as opts">
        <ng-container *ngIf="to._flatOptions else grouplist">
          <ng-container *ngFor="let opt of opts">
            <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
          </ng-container>
        </ng-container>

        <ng-template #grouplist>
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
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

    <ng-template #singleSelect>
      <select class="form-control"
        #select
        [formControl]="formControl"
        [compareWith]="to.compareWith || compareWith"
        [class.custom-select]="to.customSelect"
        [class.is-invalid]="showError"
        [formlyAttributes]="field">
        <option *ngIf="to.placeholder" [ngValue]="null">{{ to.placeholder }}</option>
        <ng-container *ngIf="to.options | formlySelectOptions:field | async as opts">
          <ng-container *ngIf="to._flatOptions else grouplist">
            <ng-container *ngFor="let opt of opts">
              <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
            </ng-container>
          </ng-container>

          <ng-template #grouplist>
            <ng-container *ngFor="let opt of opts">
              <option *ngIf="!opt.group else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
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
    </ng-template>
  `,
})
export class FormlyFieldSelect extends FieldType implements AfterViewChecked {
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  defaultOptions = {
    templateOptions: { options: [] },
  };

  // workaround for https://github.com/angular/angular/issues/10010
  ngAfterViewChecked() {
    if (!this.to.multiple && !this.to.placeholder && this.formControl.value === null) {
      const selectEl = this.select.nativeElement;
      if (selectEl.selectedIndex !== -1
        && (!selectEl.options[selectEl.selectedIndex] || selectEl.options[selectEl.selectedIndex].value !== null)
      ) {
        this.select.nativeElement.selectedIndex = -1;
      }
    }
  }

  compareWith(o1: any, o2: any) {
    return o1 === o2;
  }
}
