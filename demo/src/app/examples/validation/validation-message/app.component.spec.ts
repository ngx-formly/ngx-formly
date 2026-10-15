import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('Validation message example', () => {
  it('shows a live summary after submit, respects nested hidden fields, and clears it on reset', async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const summary = () => fixture.nativeElement.querySelector('.alert');
    await fixture.whenStable();
    expect(summary()).toBeNull();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(summary().querySelectorAll('li')).toHaveLength(2);
    expect(summary().textContent).toContain('Name');
    expect(summary().textContent).toContain('IP Address');
    expect(summary().textContent).not.toContain('Second IP Address');

    fixture.componentInstance.form.get('name').setValue('Ada');
    await fixture.whenStable();
    expect(summary().textContent).toContain('Second IP Address');
    fixture.componentInstance.form.get('ip').setValue('abc');
    await fixture.whenStable();
    expect(summary().querySelectorAll('li')).toHaveLength(3);
    const ipField = fixture.nativeElement.querySelector('input[id*="_ip_"]').closest('formly-field');
    expect(ipField.querySelector('formly-validation-message').textContent).toBe(
      '"abc" is not a valid IP Address\nShould have atleast 7 characters',
    );
    expect(summary().textContent).toContain('Should have atleast 7 characters');
    expect(summary().textContent).toContain('"abc" is not a valid IP Address');
    fixture.componentInstance.form.get('ip').setValue('127.0.0.1');
    await fixture.whenStable();
    expect(summary().querySelectorAll('li')).toHaveLength(1);

    fixture.nativeElement.querySelector('button[type="button"]').click();
    await fixture.whenStable();
    expect(summary()).toBeNull();
    expect(fixture.componentInstance.model).toEqual({});
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(summary().querySelectorAll('li')).toHaveLength(2);
  });
});
