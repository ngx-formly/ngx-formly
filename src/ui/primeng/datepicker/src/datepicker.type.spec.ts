import { formatDate } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyDatePickerModule } from '@ngx-formly/primeng/datepicker';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [FormlyDatePickerModule, BrowserAnimationsModule],
  });
};

describe('ui-primeng: Date Picker Type', () => {
  it('should render datepicker type', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'datepicker',
      templateOptions: {
        dateFormat: 'yy/mm/dd',
      },
    });

    expect(query('formly-wrapper-primeng-form-field')).not.toBeNull();
  });

  it('should add "ng-invalid" class on invalid', () => {
    const { query } = renderComponent({
      key: 'name',
      type: 'datepicker',
      validation: { show: true },
      templateOptions: { required: true },
    });

    const { classes } = query('p-calendar');
    expect(classes['ng-invalid']).toBeTrue();
  });

  it('should render control value on correct date format', () => {
    const { query, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'datepicker',
      templateOptions: {
        dateFormat: 'yy/mm/dd',
      },
    });

    field.formControl.setValue(new Date());
    detectChanges();
    expect(query('p-calendar').componentInstance.inputFieldValue).toBe(formatDate(Date.now(), 'yyyy/MM/dd', 'en-US'));
  });
});
