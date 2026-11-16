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
    expect(fixture.nativeElement.textContent).toContain('Name is required.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('applies edited labels and rules without losing the model or reformatting the draft', async () => {
    vi.useFakeTimers();
    const fixture = renderHome();
    const editor: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const fields = JSON.parse(editor.value);
    fields[0].props = { label: 'Full name', required: false, placeholder: 'Your name' };
    fields[1].props.required = true;
    const draft = JSON.stringify(fields, null, 4);
    editor.value = draft;
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const [name, email]: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('input');
    expect(name.value).toBe('Alex');
    expect(name.required).toBe(false);
    expect(name.placeholder).toBe('Your name');
    expect(fixture.nativeElement.querySelector('label[for="' + name.id + '"]').textContent).toContain('Full name');
    expect(email.required).toBe(true);
    email.dispatchEvent(new Event('blur'));
    name.value = 'Sam';
    name.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(fixture.nativeElement.querySelector('[aria-label="Current form model"]').textContent).toContain('Sam');
    expect(editor.value).toBe(draft);
    expect(editor.getAttribute('aria-invalid')).toBe('false');
  });

  it('preserves invalid drafts and the working form, then recovers when corrected', () => {
    const fixture = renderHome();
    const editor: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const original = editor.value;
    const fields = JSON.parse(original);
    const field = fields[0];
    const invalidDrafts = [
      '',
      '{',
      'null',
      '{}',
      '[null]',
      JSON.stringify([{ ...field, type: 'unknown' }]),
      JSON.stringify([{ ...field, key: '__proto__' }]),
      JSON.stringify([{ ...field, key: 'constructor' }]),
      JSON.stringify([{ ...field, key: 'person.name' }]),
      JSON.stringify([field, field]),
      JSON.stringify([{ ...field, props: null }]),
      JSON.stringify([{ ...field, props: { label: ' ' } }]),
      JSON.stringify([{ ...field, props: { label: 'Name', required: 'false' } }]),
      JSON.stringify([{ ...field, props: { label: 'Name', type: 'file' } }]),
      JSON.stringify([{ ...field, props: { label: 'Name', placeholder: {} } }]),
      JSON.stringify([{ ...field, expressions: { hide: 'true' } }]),
      JSON.stringify([{ ...field, props: { label: 'Name', keydown: 'alert(1)' } }]),
    ];

    for (const draft of invalidDrafts) {
      editor.value = draft;
      editor.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(editor.value).toBe(draft);
      expect(editor.getAttribute('aria-invalid')).toBe('true');
      expect(editor.getAttribute('aria-describedby')).toContain('configuration-error');
      expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Use');
      expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(2);
      expect(fixture.nativeElement.querySelector('input').value).toBe('Alex');
    }

    editor.value = original;
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(editor.getAttribute('aria-invalid')).toBe('false');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.componentInstance.model).toEqual({ name: 'Alex', email: '' });
  });

  it('adds and removes input fields through the editor', async () => {
    vi.useFakeTimers();
    const fixture = renderHome();
    const editor: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const fields = JSON.parse(editor.value);
    fields.push({ key: 'company', type: 'input', props: { label: 'Company' } });
    editor.value = JSON.stringify(fields);
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const company: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[2];
    company.value = 'Example';
    company.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="Current form model"]').textContent).toContain('Example');

    editor.value = '[]';
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(0);
    expect(editor.getAttribute('aria-invalid')).toBe('false');
  });
});
