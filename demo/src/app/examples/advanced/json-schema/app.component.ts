import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
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
  ];

  constructor(private formlyJsonschema: FormlyJsonschema, private http: HttpClient) {
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
          this.fields = [this.formlyJsonschema.toFieldConfig(schema)];
          this.model = model;
        }),
      )
      .subscribe();
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
