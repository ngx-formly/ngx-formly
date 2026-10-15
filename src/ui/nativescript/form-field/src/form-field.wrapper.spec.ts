import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { Subject } from 'rxjs';
import { FormlyWrapperFormField } from './form-field.wrapper';

describe('ui-nativescript: FormField Wrapper bindings', () => {
  it.each([false, true])('binds messages and wrapping with showAllErrors=%p', (showAllErrors) => {
    const translation = new Subject<string>();
    const { query, field, detectChanges } = createFieldComponent(
      {
        key: 'name',
        wrappers: ['form-field'],
        validation: { show: true, showAllErrors },
        validators: {
          first: { expression: () => false, message: 'First error.' },
          second: { expression: () => false, message: () => translation },
        },
      },
      {
        declarations: [FormlyWrapperFormField],
        config: { wrappers: [{ name: 'form-field', component: FormlyWrapperFormField }] },
        schemas: [NO_ERRORS_SCHEMA],
      },
    );

    const label = () => query('.text-danger').properties;
    expect(label().text).toBe('First error.');
    expect(label().textWrap).toBe(showAllErrors ? true : undefined);
    expect(query<HTMLElement>('formly-validation-message').nativeElement.style.whiteSpace).toBe('normal');
    translation.next('Second error.');
    detectChanges();
    expect(label().text).toBe(showAllErrors ? 'First error.\nSecond error.' : 'First error.');

    field.formControl.setErrors(null);
    detectChanges();
    expect(query('.text-danger')).toBeNull();
    expect(translation.observers).toHaveLength(0);
  });
});
