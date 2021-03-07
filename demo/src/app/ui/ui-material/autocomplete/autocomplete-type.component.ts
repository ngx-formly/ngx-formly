import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'formly-autocomplete-type',
  template: `
    <input
      matInput
      [matAutocomplete]="auto"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [errorStateMatcher]="errorStateMatcher"
    />
    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let value of filter | async" [value]="value">
        {{ value }}
      </mat-option>
    </mat-autocomplete>
  `,
})
export class AutocompleteTypeComponent extends FieldType implements OnInit {
  filter: Observable<any>;

  ngOnInit() {
    super.ngOnInit();
    this.filter = this.formControl.valueChanges.pipe(
      startWith(''),
      switchMap((term) => this.to.filter(term)),
    );
  }
}
