import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';
import { routes } from './app.routes';

function renderHome() {
  TestBed.configureTestingModule({
    imports: [HomeComponent],
    providers: [provideRouter([]), ...routes[0].providers],
  });
  const fixture = TestBed.createComponent(HomeComponent);
  fixture.detectChanges();
  return fixture;
}

describe('Homepage form example', () => {
  it('updates the displayed model when a visitor edits a generated field', async () => {
    vi.useFakeTimers();
    const fixture = renderHome();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Alex');

    input.value = 'Sam';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(fixture.componentInstance.model.name).toBe('Sam');
    expect(fixture.nativeElement.querySelector('[aria-label="Current form model"]').textContent).toContain('Sam');
  });

  it('shows the configured validation message when the required name is cleared', async () => {
    vi.useFakeTimers();
    const fixture = renderHome();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.invalid).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Please enter your name.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
