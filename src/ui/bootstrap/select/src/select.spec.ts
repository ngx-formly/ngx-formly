import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { FormlyBootstrapSelectModule } from '@ngx-formly/bootstrap/select';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { By } from '@angular/platform-browser';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [FormlyBootstrapSelectModule],
  });
};

describe('ui-bootstrap: Formly Field Select Component', () => {
  describe('render select options', () => {
    it('should correctly bind to a static array of data', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(3);
    });

    it('should correctly bind to an Observable', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ]),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      expect(fixture.debugElement.query(By.css('select')).nativeElement.options.length).toEqual(3);
    });
  });
});
