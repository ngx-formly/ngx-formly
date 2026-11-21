import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { takeUntil, tap } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { JSONSchema7 } from 'json-schema';

import { FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  form: UntypedFormGroup;
  model: unknown;
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
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.loadExample(this.examples[0]);
  }

  loadExample(type: string) {
    this.http
      .get<{ schema: JSONSchema7; model: unknown }>(`assets/json-schema/${type}_json`)
      .pipe(
        tap(({ schema, model }) => {
          this.type = type;
          this.form = new UntypedFormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(schema, { ignoreImplicitStringDefaults: true })];
          this.model = model;
          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  submit() {
    alert(JSON.stringify(this.model));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
