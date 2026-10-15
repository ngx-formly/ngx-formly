import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createComponent } from '@ngx-formly/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('Material select trigger example', () => {
  it('should display the country code and selected weeks without changing the model', async () => {
    const { query, queryAll, fixture, detectChanges } = createComponent({
      template: '<formly-app-example />',
      inputs: {},
      imports: [NoopAnimationsModule, AppComponent],
      providers: appConfig.providers,
    });
    await fixture.whenStable();
    detectChanges();

    expect(queryAll('.mat-mdc-select-value-text').map((trigger) => trigger.nativeElement.textContent)).toEqual([
      'CH',
      'Weeks: 1, 2',
    ]);
    const example: AppComponent = query('formly-app-example').componentInstance;
    expect(example.model).toEqual({ country: { code: 'CH' }, weeks: [1, 2] });
  });
});
