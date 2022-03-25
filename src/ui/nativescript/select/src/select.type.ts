import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { action } from '@nativescript/core/ui/dialogs';

@Component({
  selector: 'formly-field-ns-select',
  template: `
    <ng-container *ngIf="props.options | formlySelectOptions: field | async as options">
      <Button (tap)="tap(options)" [text]="selectedItem(options)"></Button>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig> {
  tap(options: any[]) {
    action({ title: this.props.label, actions: options.map((o) => o.label) }).then((selectedAction) =>
      this.formControl.patchValue(options.find((o) => o.label === selectedAction).value),
    );
  }

  selectedItem(options: any[]) {
    if (this.formControl.value) {
      return options.find((o) => o.value === this.formControl.value).label;
    }

    return this.props.placeholder;
  }
}
