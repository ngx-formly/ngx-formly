import { fakeAsync, tick } from '@angular/core/testing';
import { createFormlyFieldComponent } from '@ngx-formly/core/testing';
import { By } from '@angular/platform-browser';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { FormlyMatSelectModule } from '@ngx-formly/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFormlyFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatSelectModule],
  });
};

describe('ui-material: Formly Field Select Component', () => {
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

      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
    });

    it('should correctly bind to an Observable', fakeAsync(() => {
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

      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(3);
      fixture.destroy();
      tick(1000);
    }));
  });

  describe('multi select', () => {
    it('should have a "Select All" option if configured', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          multiple: true,
          selectAllOption: 'Select All',
          options: [
            { value: '1', label: 'Soccer' },
            { value: '2', label: 'Basketball' },
            { value: '3', label: 'Martial Arts' },
          ],
        },
      });
      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('mat-option')).length).toEqual(1 + 3);
    });

    it('should select all options if clicking the "Select All" option', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          multiple: true,
          selectAllOption: 'Select All',
          options: [
            { value: '1', label: 'Soccer' },
            { value: '2', label: 'Basketball' },
            { value: '3', label: 'Martial Arts' },
          ],
        },
      });
      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const selectAllOption = fixture.debugElement.queryAll(By.css('mat-option'))[0].nativeElement;
      selectAllOption.click();
      fixture.detectChanges();

      const { formControl } = fixture.componentInstance.field;
      expect(formControl.value.length).toEqual(3);

      // clicking again should deselect all
      selectAllOption.click();
      fixture.detectChanges();

      expect(formControl.value.length).toEqual(0);
    });

    it('should select all options (with group) if clicking the "Select All" option', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          multiple: true,
          selectAllOption: 'Click me!!',
          options: [
            { label: 'Iron Man', value: 'iron_man', group: 'Male' },
            { label: 'Captain America', value: 'captain_america', group: 'Male' },
            { label: 'Black Widow', value: 'black_widow', group: 'Female' },
            { label: 'Hulk', value: 'hulk', group: 'Male' },
            { label: 'Captain Marvel', value: 'captain_marvel', group: 'Female' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const selectAllOption = fixture.debugElement.queryAll(By.css('mat-option'))[0].nativeElement;
      selectAllOption.click();
      fixture.detectChanges();

      const { formControl } = fixture.componentInstance.field;
      expect(formControl.value.length).toEqual(5);

      // clicking again should deselect all
      selectAllOption.click();
      fixture.detectChanges();

      expect(formControl.value.length).toEqual(0);
    });

    it('should use the selectAllOption prop as label for the option entry', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          multiple: true,
          selectAllOption: 'Click me!!',
          options: [{ id: '1', name: 'Soccer' }, { id: '2', name: 'Basketball' }, { id: '3', name: 'Martial Arts' }],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const selectAllOption = fixture.debugElement.queryAll(By.css('mat-option'))[0].nativeElement;
      expect(selectAllOption.innerHTML).toContain('Click me!!');
    });

    it('should correctly bind a multi select to an observable', fakeAsync(() => {
      // bind a value which triggers the error in case
      const fixture = renderComponent({
        model: { sportId: [1] },
        key: 'sportId',
        type: 'select',
        templateOptions: {
          multiple: true,
          selectAllOption: 'Click me!!',
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: '3', name: 'Martial Arts' },
          ]).pipe(timeout(50)),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      tick(51);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      const selectAllOption = fixture.debugElement.queryAll(By.css('mat-option'))[0].nativeElement;
      expect(selectAllOption.innerHTML).toContain('Click me!!');
    }));

    it('should correctly use custom aria-labelledby', () => {
      const fixture = renderComponent({
        key: 'sportId',
        type: 'select',
        templateOptions: {
          attributes: {
            'aria-labelledby': 'TEST_LABEL',
          },
          options: [],
        },
      });

      const selectEl = fixture.debugElement.query(By.css('.mat-select')).nativeElement;

      expect(selectEl.getAttribute('aria-labelledby')).toBe('TEST_LABEL');
    });
  });
});
