import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FirstDataRenderedEvent, GridOptions, ColDef } from 'ag-grid-community';
import { GridFormlyCellComponent } from './grid-formly-cell.component';

@Component({
  selector: 'formly-field-grid',
  template: `
    <div [ngStyle]="style">
      <ag-grid-angular
        style="width: 100%; height: 100%"
        class="className"
        [gridOptions]="gridOptions"
        [rowData]="model"
        (firstDataRendered)="onFirstDataRendered($event)"
      >
      </ag-grid-angular>
    </div>
  `,
})
export class GridTypeComponent extends FieldArrayType implements OnInit {
  gridOptions: GridOptions;
  style: any = {};

  ngOnInit() {
    this.style = {
      width: this.to.width,
      height: this.to.height,
    };

    // map cell Renderer to Formly Component
    this.to.gridOptions.columnDefs.forEach((column: ColDef) => {
      column.cellRenderer = GridFormlyCellComponent;
    });

    // set grid options and context of the parent formly field
    const gridOptions: GridOptions = this.to.gridOptions || {};
    gridOptions.context = {
      parentField: this.field,
    };

    this.gridOptions = gridOptions;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
}
