import { createComponent, ɵCustomEvent } from '@ngx-formly/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { appConfig as galleryConfig } from '../app.config';

describe.each([
  ['standalone', appConfig],
  ['gallery', galleryConfig],
])('Ionic select example (%s)', (_name, config) => {
  it('configures only the multiple select popover and updates its model', () => {
    const { query, queryAll, detectChanges } = createComponent({
      template: '<formly-app-example />',
      inputs: {},
      imports: [AppComponent],
      providers: config.providers,
    });
    const example: AppComponent = query('formly-app-example').componentInstance;
    const [singleSelect, select] = queryAll<HTMLIonSelectElement>('ion-select');

    expect(singleSelect.nativeElement.interfaceOptions).toBeUndefined();
    expect(select.nativeElement.multiple).toBe(true);
    expect(select.nativeElement.interface).toBe('popover');
    expect(select.nativeElement.labelPlacement).toBe('floating');
    expect(select.nativeElement.interfaceOptions).toEqual({ size: 'cover', header: 'Options' });

    select.nativeElement.value = [1, 2];
    select.triggerEventHandler('ionChange', ɵCustomEvent(select.nativeElement));
    detectChanges();

    expect(example.form.get('select_multi').value).toEqual([1, 2]);
    expect(example.model).toEqual({ select_multi: [1, 2] });
  });
});
