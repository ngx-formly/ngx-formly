import { fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createFieldComponent } from '@ngx-formly/core/testing';
import { of } from 'rxjs';
import { appConfig as bootstrap } from './ui-bootstrap/app.config';
import { appConfig as ionic } from './ui-ionic/app.config';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';
import { withFormlyFieldDatepicker } from '@ngx-formly/primeng/datepicker';
import { additionalTypes as primeTypes } from './ui-primeng/additional-types.component';
import { appConfig as kendo } from './ui-kendo/app.config';
import { appConfig as zorro } from './ui-ng-zorro-antd/app.config';

const primeng = { providers: [provideFormlyCore([...withFormlyPrimeNG(), withFormlyFieldDatepicker(), primeTypes])] };

describe.each([
  ['Bootstrap', bootstrap, 'input'],
  ['Ionic', ionic, 'ion-searchbar'],
  ['PrimeNG', primeng, 'p-autocomplete'],
  ['Kendo', kendo, 'kendo-autocomplete'],
  ['Zorro', zorro, 'input[nz-input]'],
] as const)('%s gallery controls', (name, config, autocompleteSelector) => {
  it.each(['native-select', 'datepicker', 'toggle', 'slider', 'autocomplete'])(
    'renders %s with its framework and propagates disabled state',
    (type) => {
      const { field, queryAll, detectChanges } = createFieldComponent(
        {
          key: 'value',
          type,
          props: {
            label: 'Example',
            placeholder: 'Choose',
            required: true,
            options: [{ label: 'One', value: 1 }],
            filter: () => of(['California']),
          },
        },
        { providers: config.providers, imports: [NoopAnimationsModule] },
      );
      expect(field.formControl).toBeDefined();
      const controls = queryAll(
        'input, select, ion-toggle, ion-range, ion-item, ion-searchbar, button, kendo-switch, nz-slider, p-slider, [role="slider"]',
      );
      expect(controls.length).toBeGreaterThan(0);
      if (type === 'native-select') {
        const select = queryAll<HTMLSelectElement>('select')[0].nativeElement;
        expect(select.selectedOptions[0]?.textContent).toContain('Choose');
      }
      field.props.disabled = true;
      field.options.detectChanges(field);
      detectChanges();
      expect(field.formControl.disabled).toBe(true);
      expect(
        controls.some(
          ({ nativeElement: control }) =>
            control.hasAttribute('disabled') ||
            control.getAttribute('aria-disabled') === 'true' ||
            control.closest('.k-disabled, .ant-slider-disabled, .p-disabled, .ant-picker-disabled') ||
            (control as HTMLInputElement).disabled,
        ),
      ).toBe(true);
    },
  );

  it('filters autocomplete suggestions', fakeAsync(() => {
    const filter = jest.fn((term: string) => of(['California', 'Colorado'].filter((state) => state.startsWith(term))));
    const { query, field, detectChanges } = createFieldComponent(
      {
        key: 'value',
        type: 'autocomplete',
        props: { label: 'State', filter },
      },
      { providers: config.providers, imports: [NoopAnimationsModule] },
    );
    const control = query<HTMLInputElement>(autocompleteSelector);
    if (name === 'PrimeNG') {
      control.triggerEventHandler('completeMethod', { query: 'Cal' });
    } else if (name === 'Kendo') {
      control.triggerEventHandler('filterChange', 'Cal');
    } else if (name === 'Bootstrap') {
      control.nativeElement.value = 'Cal';
      control.nativeElement.dispatchEvent(new Event('input'));
    } else {
      field.formControl.setValue('Cal');
    }
    tick(200);
    detectChanges();
    expect(filter).toHaveBeenLastCalledWith('Cal');
    if (name === 'Ionic') {
      control.triggerEventHandler('ionFocus', {});
      detectChanges();
      control.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      control.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(field.formControl.value).toBe('California');
      expect(field.formControl.dirty).toBe(true);
      expect(field.formControl.touched).toBe(true);
      field.formControl.setValue('C');
      detectChanges();
      control.triggerEventHandler('ionFocus', {});
      control.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      control.triggerEventHandler('keydown', new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(field.formControl.value).toBe('Colorado');
    }
  }));
});
