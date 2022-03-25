import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormlyFieldConfig, FieldArrayType } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';

@Component({
  selector: 'formly-field-datatable',
  template: `
    <ngx-datatable
      #table
      class="bootstrap"
      [rows]="model"
      [columns]="props.columns"
      [columnMode]="props.columnMode"
      [rowHeight]="props.rowHeight"
      [headerHeight]="props.headerHeight"
      [footerHeight]="props.footerHeight"
      [limit]="props.limit"
      [scrollbarH]="props.scrollbarH"
      [reorderable]="props.reorderable"
      [externalSorting]="true"
    >
      <ng-template
        #defaultColumn
        ngx-datatable-cell-template
        let-rowIndex="rowIndex"
        let-value="value"
        let-row="row"
        let-column="column"
      >
        <formly-field [field]="getField(field, column, rowIndex)"></formly-field>
      </ng-template>
    </ngx-datatable>
  `,
})
export class DatatableTypeComponent extends FieldArrayType implements OnInit {
  @ViewChild('defaultColumn', { static: true }) public defaultColumn!: TemplateRef<any>;

  ngOnInit() {
    (this.props.columns as TableColumn[]).forEach((column) => (column.cellTemplate = this.defaultColumn));
  }

  getField(parent: FormlyFieldConfig, column: TableColumn, rowIndex: number): FormlyFieldConfig {
    return parent.get([rowIndex, column.prop]);
  }
}
