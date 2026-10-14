import { provideIonicAngular, IonDatetime } from '@ionic/angular';
import { provideFormlyCore } from '@ngx-formly/core';
import { createFieldComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { FormlyIonicModule, withFormlyIonic } from '@ngx-formly/ionic';
import { withFormlyFieldDatetime } from '@ngx-formly/ionic/datetime';
import { withFormlyFieldSlider } from '@ngx-formly/ionic/slider';
import { withFormlyFieldToggle } from '@ngx-formly/ionic/toggle';

describe.each([
  ['NgModule', { imports: [FormlyIonicModule], providers: [provideIonicAngular()] }],
  [
    'providers',
    {
      providers: [
        provideIonicAngular(),
        provideFormlyCore([
          ...withFormlyIonic(),
          withFormlyFieldDatetime(),
          withFormlyFieldSlider(),
          withFormlyFieldToggle(),
        ]),
      ],
    },
  ],
])('ui-ionic: Ionic 9 (%s)', (_name, config) => {
  it.each([
    ['input', 'ion-input', 'value', 'ionInput', 'before', 'after'],
    ['number', 'ion-input', 'value', 'ionInput', 1, 2],
    ['textarea', 'ion-textarea', 'value', 'ionInput', 'before', 'after'],
    ['checkbox', 'ion-checkbox', 'checked', 'ionChange', false, true],
    ['radio', 'ion-radio-group', 'value', 'ionChange', 1, 2],
    ['select', 'ion-select', 'value', 'ionChange', 1, 2],
    ['toggle', 'ion-toggle', 'checked', 'ionChange', false, true],
    ['slider', 'ion-range', 'value', 'ionInput', 1, 2],
  ])('binds %s to its standalone Ionic control', (type: string, selector: string, property, event, initial, value) => {
    const { field, query, detectChanges } = createFieldComponent(
      {
        key: 'value',
        type,
        defaultValue: initial,
        props: {
          label: 'Value',
          options: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
          ],
        },
      },
      config,
    );
    const control = query<HTMLElement & { disabled: boolean }>(selector);

    expect(query('formly-wrapper-ion-form-field')).not.toBeNull();
    expect(control.nativeElement[property as string]).toBe(initial);

    control.nativeElement[property as string] = value;
    control.triggerEventHandler(event as string, ɵCustomEvent(control.nativeElement));
    control.triggerEventHandler('ionBlur', ɵCustomEvent(control.nativeElement));
    detectChanges();

    expect(field.formControl.value).toBe(value);
    expect(field.model.value).toBe(value);
    expect(field.formControl.touched).toBe(true);

    field.formControl.disable();
    detectChanges();
    expect(control.nativeElement.disabled).toBe(true);
  });

  it('creates the standalone datetime in its modal and updates the form control', () => {
    const { field, query, detectChanges } = createFieldComponent(
      { key: 'date', type: 'datetime', defaultValue: '2026-01-01', props: { label: 'Date' } },
      config,
    );
    query('ion-modal').nativeElement.dispatchEvent(new CustomEvent('ionMount'));
    field.options.detectChanges(field);
    detectChanges();

    const datetime = query<HTMLIonDatetimeElement>('ion-datetime');
    expect(datetime.componentInstance).toBeInstanceOf(IonDatetime);
    expect(query('formly-field-ion-datetime').componentInstance.datetime).toBe(datetime.componentInstance);
    expect(datetime.nativeElement.value).toBe('2026-01-01');

    datetime.nativeElement.value = '2026-02-01';
    datetime.triggerEventHandler('ionChange', ɵCustomEvent(datetime.nativeElement));
    query('ion-modal').triggerEventHandler('didDismiss', {});
    detectChanges();

    expect(field.model.date).toBe('2026-02-01');
    expect(field.formControl.touched).toBe(true);
  });
});
