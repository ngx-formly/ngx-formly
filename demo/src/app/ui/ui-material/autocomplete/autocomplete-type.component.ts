import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'formly-autocomplete-type',
  template: `
    <input
      matInput
      [matAutocomplete]="auto"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder"
      [errorStateMatcher]="errorStateMatcher"
    />
    <mat-autocomplete #auto="matAutocomplete">
      @for (value of filter | async; track value) {
        <mat-option [value]="value">
          {{ value }}
        </mat-option>
      }
    </mat-autocomplete>
  `,
  imports: [
    MatInput,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    FormlyAttributes,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
  ],
})
export class AutocompleteTypeComponent extends FieldType<FieldTypeConfig> implements OnInit {
  filter: Observable<any>;

  ngOnInit() {
    this.filter = this.formControl.valueChanges.pipe(
      startWith(''),
      switchMap((term) => this.props.filter(term)),
    );
  }
}
