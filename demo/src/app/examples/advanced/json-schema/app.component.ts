import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { takeUntil, tap } from 'rxjs/operators';

import { Subject } from 'rxjs';

import { FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent implements OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  form: UntypedFormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  type: string;
  examples = [
    'simple',
    'nested',
    'arrays',
    'numbers',
    'references',
    'schema_dependencies',
    'null_field',
    'nullable',
    'allOf',
    'anyOf',
    'oneOf',
    'select_alternatives',
    'if_then_else',
  ];

  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private http: HttpClient,
  ) {
    this.loadExample(this.examples[0]);
  }

  loadExample(type: string) {
    this.http
      .get<any>(`assets/json-schema/${type}_json`)
      .pipe(
        tap(({ schema, model }) => {
          this.type = type;
          this.form = new UntypedFormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(schema, { ignoreImplicitStringDefaults: true })];
          this.model = model;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  submit() {
    alert(JSON.stringify(this.model));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
