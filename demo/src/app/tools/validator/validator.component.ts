import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { basicSetup, EditorView } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { lintGutter, setDiagnostics } from '@codemirror/lint';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { applyEdits, format } from 'jsonc-parser';
import { ConfigurationDiagnostic, validateFormlyJson } from './validate-formly-json';

const EXAMPLE =
  '[\n  {\n    "key": "email",\n    "type": "input",\n    "props": {\n      "label": "Email",\n      "type": "email",\n      "required": true\n    }\n  }\n]';

@Component({
  imports: [MatButton, MatIcon, RouterLink],
  selector: 'formly-validator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './validator.component.scss',
  templateUrl: './validator.component.html',
})
export class ValidatorComponent {
  private readonly editorHost = viewChild.required<ElementRef<HTMLElement>>('editorHost');
  private readonly zone = inject(NgZone);
  private editor?: EditorView;
  private timer?: ReturnType<typeof setTimeout>;
  readonly source = signal('');
  readonly pending = signal(false);
  readonly result = signal(validateFormlyJson(''));
  readonly errorCount = computed(() => this.result().diagnostics.filter((item) => item.severity === 'error').length);
  readonly warningCount = computed(() => this.result().diagnostics.length - this.errorCount());
  readonly summary = computed(() => {
    if (this.pending()) return 'Checking configuration…';
    if (this.result().empty) return 'Paste your fields to begin.';
    return this.errorCount()
      ? `${this.errorCount()} ${this.errorCount() === 1 ? 'error' : 'errors'} found`
      : 'No structural errors found.';
  });
  readonly diagnostics = computed(() =>
    this.result().diagnostics.map((diagnostic) => {
      const before = this.source().slice(0, diagnostic.offset);
      return {
        ...diagnostic,
        line: before.split('\n').length,
        column: diagnostic.offset - before.lastIndexOf('\n'),
        label:
          '$' +
          diagnostic.path
            .map((part) =>
              typeof part === 'number'
                ? `[${part}]`
                : /^[a-zA-Z_$][\w$]*$/.test(part)
                  ? `.${part}`
                  : `[${JSON.stringify(part)}]`,
            )
            .join(''),
      };
    }),
  );

  constructor() {
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => {
        this.editor = new EditorView({
          parent: this.editorHost().nativeElement,
          extensions: [
            basicSetup,
            json(),
            lintGutter(),
            EditorView.lineWrapping,
            EditorView.contentAttributes.of({
              'aria-label': 'Formly fields JSON',
              'aria-describedby': 'json-instructions validation-scope',
              spellcheck: 'false',
            }),
            syntaxHighlighting(
              HighlightStyle.define([
                { tag: tags.propertyName, color: 'var(--site-ink)' },
                { tag: tags.string, color: 'var(--site-code)' },
                { tag: [tags.number, tags.bool, tags.null], color: 'var(--site-accent)' },
                { tag: tags.punctuation, color: 'var(--site-muted)' },
              ]),
            ),
            EditorView.theme({
              '&': { height: '100%', backgroundColor: 'var(--site-background)', color: 'var(--site-ink)' },
              '&.cm-focused': { outline: '2px solid var(--site-accent)', outlineOffset: '-2px' },
              '.cm-scroller': {
                overflow: 'auto',
                fontFamily: 'Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '14px',
                lineHeight: '1.7',
              },
              '.cm-content': { padding: '16px 0', caretColor: 'var(--site-accent)' },
              '.cm-line': { padding: '0 16px 0 8px' },
              '.cm-gutters': {
                backgroundColor: 'var(--site-soft)',
                color: 'var(--site-muted)',
                borderRight: '1px solid var(--site-line)',
              },
              '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--site-soft)' },
              '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
                backgroundColor: 'var(--site-accent-soft)',
              },
              '.cm-content ::selection': { color: 'var(--site-ink)' },
              '.cm-lintRange-warning': {
                backgroundImage: 'none',
                textDecoration: 'underline wavy var(--site-code)',
                textUnderlineOffset: '3px',
              },
              '.cm-lint-marker-warning': { content: 'normal', color: 'var(--site-code)' },
              '.cm-lint-marker-warning::before': { content: '"⚠︎"', fontSize: '14px', lineHeight: '1' },
              '.cm-cursor': { borderLeftColor: 'var(--site-accent)' },
              '.cm-tooltip, .cm-panels': {
                backgroundColor: 'var(--site-soft)',
                color: 'var(--site-ink)',
                borderColor: 'var(--site-line)',
              },
              '.cm-searchMatch': {
                backgroundColor: 'var(--site-accent-soft)',
                outline: '1px solid var(--site-accent)',
              },
            }),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) this.zone.run(() => this.scheduleValidation(update.state.doc.toString()));
            }),
          ],
        });
      }),
    );
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      this.editor?.destroy();
    });
  }

  loadExample() {
    this.replaceSource(EXAMPLE);
  }

  formatJson() {
    if (this.pending() || !this.result().syntaxValid) return;
    this.replaceSource(applyEdits(this.source(), format(this.source(), undefined, { insertSpaces: true, tabSize: 2 })));
  }

  selectDiagnostic(diagnostic: ConfigurationDiagnostic) {
    if (!this.editor || this.pending()) return;
    const from = Math.min(diagnostic.offset, this.editor.state.doc.length);
    const to = Math.min(from + diagnostic.length, this.editor.state.doc.length);
    this.editor.dispatch({
      selection: { anchor: from, head: to },
      effects: EditorView.scrollIntoView(from, { y: 'center' }),
    });
    this.editor.focus();
  }

  private replaceSource(source: string) {
    this.editor?.dispatch({ changes: { from: 0, to: this.editor.state.doc.length, insert: source } });
    this.editor?.focus();
  }

  private scheduleValidation(source: string) {
    clearTimeout(this.timer);
    this.source.set(source);
    this.pending.set(true);
    this.timer = setTimeout(() => {
      const result = validateFormlyJson(source);
      this.result.set(result);
      this.pending.set(false);
      this.editor.dispatch(
        setDiagnostics(
          this.editor.state,
          result.diagnostics.map((item) => ({
            from: item.offset,
            to: item.offset + item.length,
            severity: item.severity,
            message: item.message,
          })),
        ),
      );
    }, 300);
  }
}
