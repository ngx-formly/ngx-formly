import { fakeAsync, tick } from '@angular/core/testing';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { FormlyMatSelectModule } from '@ngx-formly/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderComponent = (field: FormlyFieldConfig) => {
  return createFieldComponent(field, {
    imports: [NoopAnimationsModule, FormlyMatSelectModule],
  });
};

describe('ui-material: Formly Field Select Component', () => {
  it('should render select type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
    detectChanges();

    expect(queryAll('mat-option')).toHaveLength(3);
  });

  it('should render enum type', () => {
    const { query, queryAll, detectChanges } = renderComponent({
      key: 'name',
      type: 'enum',
      props: {
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
          { value: 3, label: 'label 3' },
        ],
      },
    });

    expect(query('formly-wrapper-mat-form-field')).not.toBeNull();

    query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
    detectChanges();

    expect(queryAll('mat-option')).toHaveLength(3);
  });

  it('should bind control value on change', () => {
    const changeSpy = jest.fn();
    const { query, queryAll, field, detectChanges } = renderComponent({
      key: 'name',
      type: 'select',
      props: {
        placeholder: 'Name',
        change: changeSpy,
        options: [
          { value: 1, label: 'label 1' },
          { value: 2, label: 'label 2' },
        ],
      },
    });

    expect(field.formControl.value).toBeUndefined();
    query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
    detectChanges();

    const selectAllOption = queryAll('mat-option')[1];
    selectAllOption.triggerEventHandler('click', {});
    detectChanges();
    expect(field.formControl.value).toEqual(2);
    expect(changeSpy).toHaveBeenCalledOnce();
  });

  describe('render select options', () => {
    it('should correctly bind to a static array of data', () => {
      const { query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      expect(queryAll('mat-option')).toHaveLength(3);
    });

    it('should correctly bind to an Observable', () => {
      const { query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ]),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      expect(queryAll('mat-option')).toHaveLength(3);
    });

    it('panelClass should be used to add class to select overlay div', () => {
      const panelClass = 'my-custom-panel-class';

      const { query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          panelClass,
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: { test: 'A' }, name: 'Not Soccer or Basketball' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      const panel = queryAll('div').find((x) => !!x.classes[panelClass]);
      expect(panel).not.toBeNull();
    });
  });

  describe('multi select', () => {
    it('should have a "Select All" option if configured', () => {
      const { query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          multiple: true,
          selectAllOption: 'Select All',
          options: [
            { value: '1', label: 'Soccer' },
            { value: '2', label: 'Basketball' },
            { value: '3', label: 'Martial Arts' },
          ],
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      expect(queryAll('mat-option')).toHaveLength(1 + 3);
    });

    it('should select all options if clicking the "Select All" option', () => {
      const { field, query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          multiple: true,
          selectAllOption: 'Select All',
          options: [
            { value: '1', label: 'Soccer' },
            { value: '2', label: 'Basketball' },
            { value: '3', label: 'Martial Arts' },
          ],
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      const selectAllOption = queryAll('mat-option')[0];
      selectAllOption.triggerEventHandler('click', {});
      detectChanges();

      const { formControl } = field;
      expect(formControl.value).toHaveLength(3);

      // clicking again should deselect all
      selectAllOption.triggerEventHandler('click', {});
      detectChanges();

      expect(formControl.value).toHaveLength(0);
    });

    it('should select all options (with group) if clicking the "Select All" option', () => {
      const { field, query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
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

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      const selectAllOption = queryAll('mat-option')[0];
      selectAllOption.triggerEventHandler('click', {});
      detectChanges();

      const { formControl } = field;
      expect(formControl.value).toHaveLength(5);

      // clicking again should deselect all
      selectAllOption.triggerEventHandler('click', {});
      detectChanges();

      expect(formControl.value).toHaveLength(0);
    });

    it('should use the selectAllOption prop as label for the option entry', () => {
      const { query, queryAll, detectChanges } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          multiple: true,
          selectAllOption: 'Click me!!',
          options: [
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: '3', name: 'Martial Arts' },
          ],
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      const selectAllOption = queryAll('mat-option')[0].nativeElement;
      expect(selectAllOption.innerHTML).toContain('Click me!!');
    });

    it('should correctly bind a multi select to an observable', () => {
      // bind a value which triggers the error in case
      const { query, queryAll, detectChanges } = renderComponent({
        model: { sportId: [1] },
        key: 'sportId',
        type: 'select',
        props: {
          multiple: true,
          selectAllOption: 'Click me!!',
          options: of([
            { id: '1', name: 'Soccer' },
            { id: '2', name: 'Basketball' },
            { id: '3', name: 'Martial Arts' },
          ]),
          valueProp: 'id',
          labelProp: 'name',
        },
      });

      // tick(100);
      detectChanges();

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();

      const selectAllOption = queryAll('mat-option')[0].nativeElement;
      expect(selectAllOption.innerHTML).toContain('Click me!!');
    });

    it('should correctly use custom aria-labelledby', () => {
      const { query } = renderComponent({
        key: 'sportId',
        type: 'select',
        props: {
          attributes: {
            'aria-labelledby': 'TEST_LABEL',
          },
          options: [],
        },
      });

      const { attributes } = query('mat-select');
      expect(attributes['aria-labelledby']).toBe('TEST_LABEL');
    });
  });
});
