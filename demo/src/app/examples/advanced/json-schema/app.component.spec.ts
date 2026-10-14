import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('JSON Schema example', () => {
  it('renders asynchronously loaded schemas without Zone.js change detection', async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, provideHttpClientTesting(), provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();

    http.expectOne('assets/json-schema/simple_json').flush({
      schema: { type: 'object', properties: { name: { type: 'string' } } },
      model: { name: 'Formly' },
    });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input').value).toBe('Formly');

    fixture.componentInstance.loadExample('nested');
    http.expectOne('assets/json-schema/nested_json').flush({
      schema: { type: 'object', properties: { city: { type: 'string' } } },
      model: { city: 'Bern' },
    });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input').value).toBe('Bern');
    http.verify();
  });
});
