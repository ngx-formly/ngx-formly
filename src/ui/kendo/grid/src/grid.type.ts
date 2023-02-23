import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldArrayType } from '@ngx-formly/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isFunction } from './form.array.util';

@Component({
  selector: 'formly-field-kendo-grid',
  templateUrl: './grid.type.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KendoGridComponent extends FieldArrayType {
  @ViewChild('grid')
  grid: GridComponent;

  override defaultOptions = {
    props: {
      textRemove: 'Remove',
      textCancel: 'Cancel',
      textAdd: 'Add',
      textSave: 'Save',
      textEdit: 'Edit',

      iconRemove: 'Remove',
      iconCancel: 'Cancel',
      iconAdd: 'Add',
      iconSave: 'Save',
      iconEdit: 'Edit',

      titleRemove: 'Remove',
      titleCancel: 'Cancel',
      titleAdd: 'Add',
      titleSave: 'Save',
      titleEdit: 'Edit',
      noRecordsMessage: 'No Records found.',
    },
  };

  get isEditMode() {
    return this.formControl.enabled;
  }
  get readOnly() {
    return !this.formControl.parent?.enabled;
  }
  originalDados: any[] = [];

  onEdit() {
    // store copy of original products in case cancelled
    this.originalDados = [...this.formControl.value];
    // set all rows to edit mode to display form fields
    this.editAllRows();
    this.formControl.enable();
  }
  onAdd() {
    const func: () => Observable<any> = this?.field?.props?.onAdd;
    if (func && isFunction(func)) {
      func().pipe(map((value) => this.add(null, value)));
    } else {
      this.add(null, {});
    }
  }
  override add(
    i?: number,
    initialModel?: any,
    { markAsDirty } = { markAsDirty: true }
  ) {
    super.add(i, initialModel, { markAsDirty });
    this.editAllRows();
  }

  onSave() {
    // mark all fields as touched to highlight any invalid fields
    this.formControl.markAllAsTouched();
    this.closeAllRows();
    this.formControl.disable();
  }

  onCancel() {
    this.closeAllRows();
    while (this.formControl.length > 0) {
      super.remove(0, { markAsDirty: false });
    }
    this.originalDados.forEach((a) =>
      this.add(null, a, { markAsDirty: false })
    );
    this.formControl.disable();
    this.closeAllRows();
  }

  // helper methods

  private editAllRows() {
    // set all rows to edit mode to display form fields
    this.model.forEach((x: any, i: number) => {
      this.grid.editRow(i, this.formControl.controls[i] as FormGroup);
    });
  }

  private closeAllRows() {
    // close all rows to display readonly view of data
    this.model.forEach((x: any, i: number) => {
      this.grid.closeRow(i);
    });
  }
}
