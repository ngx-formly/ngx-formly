import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EditorView } from 'codemirror';
import { ValidatorComponent } from './validator.component';

describe('JSON validator editor', () => {
  let fixture: ComponentFixture<ValidatorComponent>;
  let editor: EditorView;
  const button = (label: string): HTMLButtonElement =>
    [...fixture.nativeElement.querySelectorAll('button')].find(
      (item: HTMLButtonElement) => item.textContent.trim() === label,
    );
  const paste = (source: string) =>
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: source } });
  const settle = async () => {
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ValidatorComponent], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(ValidatorComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    editor = EditorView.findFromDOM(fixture.nativeElement.querySelector('.cm-editor'));
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('starts neutral with accessible instructions and loads a valid example', async () => {
    expect(editor.state.doc.length).toBe(0);
    expect(editor.contentDOM.getAttribute('aria-label')).toBe('Formly fields JSON');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Paste your fields to begin.');
    expect(button('Format JSON').disabled).toBe(true);
    button('Load example').click();
    await settle();
    expect(JSON.parse(editor.state.doc.toString())[0].key).toBe('email');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('No structural errors found.');
    expect(fixture.nativeElement.querySelector('#validation-scope').textContent).toContain(
      'runtime behavior are not verified',
    );
  });

  it('debounces edits and replaces diagnostics with the latest result', async () => {
    paste('[{"props":{"required":"yes"}}]');
    await vi.advanceTimersByTimeAsync(299);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.diagnostic')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Checking configuration');
    paste('[{"props":{"label":false}}]');
    await settle();
    expect(fixture.nativeElement.querySelectorAll('.diagnostic')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.diagnostic').textContent).toContain('$[0].props.label');
  });

  it('selects the exact diagnostic source range and focuses the editor', async () => {
    const source = '[\n  {"props":{"required":"yes"}}\n]';
    paste(source);
    await settle();
    const diagnostic: HTMLButtonElement = fixture.nativeElement.querySelector('.diagnostic');
    expect(diagnostic.textContent).toContain('$[0].props.required');
    expect(diagnostic.textContent).toContain('Line 2, column 24');
    expect(fixture.nativeElement.querySelector('.cm-lintRange-error')).not.toBeNull();
    diagnostic.click();
    expect(editor.state.selection.main.from).toBe(source.indexOf('"yes"'));
    expect(editor.state.sliceDoc(editor.state.selection.main.from, editor.state.selection.main.to)).toBe('"yes"');
    expect(editor.hasFocus).toBe(true);
  });

  it('keeps warnings alongside the qualified pass and clears back to empty', async () => {
    paste('[{"hideExpression":true}]');
    await settle();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('No structural errors found.');
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('1 warning');
    expect(fixture.nativeElement.querySelector('.diagnostic').textContent).toContain('Warning');
    paste('');
    await settle();
    expect(fixture.nativeElement.querySelectorAll('.diagnostic')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Paste your fields to begin.');
  });

  it('formats whitespace only, preserving strings, number spellings, and duplicate properties', async () => {
    const source = '[{"key":"a  b","defaultValue":1e2,"metadata":"\\u0061","key":"second"}]';
    paste(source);
    await settle();
    button('Format JSON').click();
    await settle();
    expect(editor.state.doc.toString()).toBe(
      '[\n  {\n    "key": "a  b",\n    "defaultValue": 1e2,\n    "metadata": "\\u0061",\n    "key": "second"\n  }\n]',
    );
  });

  it('disables formatting for invalid syntax and permits structurally invalid JSON', async () => {
    paste('[{');
    await settle();
    expect(button('Format JSON').disabled).toBe(true);
    paste('[{"type":true}]');
    await settle();
    expect(button('Format JSON').disabled).toBe(false);
  });
});
