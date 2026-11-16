import { Component } from '@angular/core';
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'formly-ag-grid-cell',
  template: ` <formly-field [field]="getField()"></formly-field> `,
  imports: [FormlyField],
})
export class GridFormlyCellComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  getField(): FormlyFieldConfig {
    const rowIndex = this.params.node.rowIndex;
    const prop = this.params.colDef.field;
    const parentField = this.params.context.parentField;

    return parentField.get([rowIndex, prop]);
  }
}
