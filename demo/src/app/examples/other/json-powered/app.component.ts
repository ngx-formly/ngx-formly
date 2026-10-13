import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { UserService } from './user.service';

import { startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  imports: [AsyncPipe, ReactiveFormsModule, FormlyForm],
})
export class AppComponent implements OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  form = new UntypedFormGroup({});
  options: FormlyFormOptions = {};
  model: any;
  fields: FormlyFieldConfig[];
  firstName$: Observable<string>;

  constructor(private userService: UserService) {
    this.userService
      .getUserData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(([model, fields]) => {
        this.model = model;
        this.fields = this.mapFields(fields);
      });
  }

  onFormChange(form: UntypedFormGroup | UntypedFormArray) {
    const firstName = form.get('firstName');
    this.firstName$ = firstName?.valueChanges.pipe(startWith(firstName.value));
  }

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }

  /**
   * Adjust the JSON fields loaded from the server.
   */
  mapFields(fields: FormlyFieldConfig[]) {
    return fields.map((f) => {
      // Bind an observable to `color` field.
      if (f.key === 'color') {
        f.type = 'radio';
        f.props.options = this.userService.getColors();
      }

      return f;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
