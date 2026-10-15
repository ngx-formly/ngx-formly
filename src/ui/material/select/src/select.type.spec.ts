import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyMatSelectModule } from '@ngx-formly/material/select';
import { of } from 'rxjs';

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
    const changeSpy = vi.fn();
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
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  describe('triggerLabel', () => {
    it.each([false, true])('should preserve default labels when multiple is %s', async (multiple) => {
      const { query, field, fixture } = renderComponent({
        key: 'name',
        type: 'select',
        props: {
          multiple,
          options: [
            { value: 1, label: 'First' },
            { value: 2, label: 'Second' },
          ],
        },
      });
      field.formControl.setValue(multiple ? [1, 2] : 1);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(query('mat-select-trigger')).toBeNull();
      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe(multiple ? 'First, Second' : 'First');
    });

    it.each([false, true])('should read value properties when multiple is %s', async (multiple) => {
      const values = [{ code: 'CH' }, { code: 'FR' }];
      const { query, queryAll, field, fixture, detectChanges } = renderComponent({
        key: 'country',
        type: 'select',
        props: {
          multiple,
          triggerLabel: 'code',
          options: [
            { value: values[0], label: 'Switzerland' },
            { value: values[1], label: 'France' },
          ],
        },
      });
      field.formControl.setValue(multiple ? values : values[0]);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe(multiple ? 'CH, FR' : 'CH');

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();
      expect(queryAll('mat-option').map((option) => option.nativeElement.textContent.trim())).toEqual([
        'Switzerland',
        'France',
      ]);
    });

    it.each([0, false])('should format a falsy single value (%s)', async (value) => {
      const triggerLabel = vi.fn((value) => `Selected: ${value}`);
      const { query, field, fixture } = renderComponent({
        key: 'name',
        type: 'select',
        props: { triggerLabel, options: [{ value, label: 'Option' }] },
      });
      field.formControl.setValue(value);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(triggerLabel).toHaveBeenCalledWith(value);
      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe(`Selected: ${value}`);
      expect(field.formControl.value).toBe(value);
    });

    it('should update a formatted selection after selection, select all, and reset', async () => {
      const triggerLabel = vi.fn((values: number[]) => `${values.length} selected`);
      const { query, queryAll, field, fixture, detectChanges } = renderComponent({
        key: 'weeks',
        type: 'select',
        props: {
          multiple: true,
          placeholder: 'Choose weeks',
          selectAllOption: 'Select All',
          triggerLabel,
          options: [
            { value: 1, label: 'Week 1' },
            { value: 2, label: 'Week 2' },
          ],
        },
      });
      await fixture.whenStable();
      fixture.detectChanges();
      expect(triggerLabel).not.toHaveBeenCalled();
      expect(query('.mat-mdc-select-placeholder').nativeElement.textContent).toBe('Choose weeks');

      query('.mat-mdc-select-trigger').triggerEventHandler('click', {});
      detectChanges();
      queryAll('mat-option')[1].triggerEventHandler('click', {});
      await fixture.whenStable();
      fixture.detectChanges();
      expect(triggerLabel).toHaveBeenCalledWith([1]);
      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe('1 selected');

      queryAll('mat-option')[0].triggerEventHandler('click', {});
      await fixture.whenStable();
      fixture.detectChanges();
      expect(triggerLabel).toHaveBeenCalledWith([1, 2]);
      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe('2 selected');
      expect(field.formControl.value).toEqual([1, 2]);

      triggerLabel.mockClear();
      queryAll('mat-option')[0].triggerEventHandler('click', {});
      await fixture.whenStable();
      fixture.detectChanges();
      expect(field.formControl.value).toEqual([]);
      expect(triggerLabel).not.toHaveBeenCalled();
      expect(query('.mat-mdc-select-placeholder').nativeElement.textContent).toBe('Choose weeks');

      field.formControl.setValue([2]);
      await fixture.whenStable();
      fixture.detectChanges();
      triggerLabel.mockClear();
      field.formControl.reset();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(triggerLabel).not.toHaveBeenCalled();
      expect(query('.mat-mdc-select-placeholder').nativeElement.textContent).toBe('Choose weeks');
    });

    it('should render custom labels as text', async () => {
      const { query, field, fixture } = renderComponent({
        key: 'name',
        type: 'select',
        props: {
          triggerLabel: () => '<b>Custom label</b>',
          options: [{ value: 1, label: 'Option' }],
        },
      });
      field.formControl.setValue(1);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(query('.mat-mdc-select-value-text').nativeElement.textContent).toBe('<b>Custom label</b>');
      expect(query('mat-select-trigger b')).toBeNull();
    });
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
