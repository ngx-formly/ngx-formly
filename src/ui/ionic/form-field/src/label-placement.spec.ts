import { createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyInputModule } from '@ngx-formly/ionic/input';
import { FormlyTextAreaModule } from '@ngx-formly/ionic/textarea';
import { FormlySelectModule } from '@ngx-formly/ionic/select';
import { FormlySliderModule } from '@ngx-formly/ionic/slider';

describe('ui-ionic: Label placement', () => {
  it.each([
    ['input', 'ion-input'],
    ['number', 'ion-input'],
    ['textarea', 'ion-textarea'],
    ['select', 'ion-select'],
    ['slider', 'ion-range'],
  ])('preserves default and custom label spacing for %s', (type, selector) => {
    const { query, field, detectChanges } = createFieldComponent(
      {
        key: 'value',
        type,
        props: { label: 'Label', options: [] },
      },
      { imports: [FormlyInputModule, FormlyTextAreaModule, FormlySelectModule, FormlySliderModule] },
    );

    expect(query(selector).componentInstance.labelPlacement).toBe('start');

    field.props.labelPosition = 'stacked';
    field.options.detectChanges(field);
    detectChanges();
    expect(query(selector).componentInstance.labelPlacement).toBe('stacked');

    field.props.labelPosition = undefined;
    field.options.detectChanges(field);
    detectChanges();
    expect(query(selector).componentInstance.labelPlacement).toBe('start');
  });
});
