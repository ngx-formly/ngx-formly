import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('JSON powered example', () => {
  it('renders remote fields and their values without Zone.js change detection', async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, provideHttpClientTesting(), provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();

    http.expectOne('assets/json-powered/user_json').flush({ firstName: 'Ada' });
    http.expectOne('assets/json-powered/user-form_json').flush([{ key: 'firstName', type: 'input' }]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('input').value).toBe('Ada');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('First name: Ada');

    fixture.componentInstance.form.get('firstName').setValue('Grace');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('First name: Grace');
    http.verify();
  });
});
