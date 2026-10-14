import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideIonicAngular } from '@ionic/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { createComponent, createFieldComponent } from '@ngx-formly/core/testing';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyKendoModule } from '@ngx-formly/kendo';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';

const label = 'Accept <strong class="html-label">terms</strong>';
const description = 'Read the <a class="html-description" href="#terms">terms</a>.';
const ionicLabelSelectors = {
  input: 'ion-input',
  number: 'ion-input',
  textarea: 'ion-textarea',
  select: 'ion-select',
  slider: 'ion-range',
};
const adapters = [
  { name: 'bootstrap', imports: [FormlyBootstrapModule], types: ['input', 'checkbox', 'radio', 'select', 'textarea'] },
  {
    name: 'material',
    imports: [FormlyMaterialModule, FormlyMatToggleModule],
    types: ['input', 'checkbox', 'radio', 'select', 'textarea', 'toggle'],
  },
  {
    name: 'ionic',
    imports: [FormlyIonicModule],
    types: ['input', 'number', 'checkbox', 'radio', 'select', 'textarea', 'toggle', 'slider', 'datetime'],
  },
  { name: 'kendo', imports: [FormlyKendoModule], types: ['input', 'checkbox', 'radio', 'select', 'textarea'] },
  { name: 'primeng', imports: [FormlyPrimeNGModule], types: ['input', 'checkbox', 'radio', 'select', 'textarea'] },
  {
    name: 'ng-zorro-antd',
    imports: [FormlyNgZorroAntdModule],
    types: ['input', 'checkbox', 'radio', 'select', 'textarea'],
  },
];

describe.each(adapters)('ui-$name: allowHtml', ({ name, imports, types }) => {
  const config = {
    imports: [NoopAnimationsModule, ...imports],
    providers: name === 'ionic' ? [provideIonicAngular()] : [],
  };
  const render = (type: string, props: FormlyFieldConfig['props']) =>
    createFieldComponent(
      { key: 'value', type, props: { options: [{ value: 1, label: '<b class="html-option">One</b>' }], ...props } },
      config,
    );

  describe.each(types)('%s', (type) => {
    it.each([undefined, false, true])('renders labels and descriptions with allowHtml=%s', (allowHtml) => {
      const { query } = render(type, { label, description, allowHtml, safeHtml: true });
      if (allowHtml) {
        expect(query('.html-label').nativeElement.textContent).toBe('terms');
        expect(query('.html-description').nativeElement.getAttribute('href')).toBe('#terms');
      } else {
        expect(query('.html-label')).toBeNull();
        expect(query('.html-description')).toBeNull();
        expect(query('formly-field').nativeElement.textContent).toContain(description);
        if (name === 'ionic' && ionicLabelSelectors[type]) {
          expect(query(ionicLabelSelectors[type]).componentInstance.label).toBe(label);
        } else if (name === 'ionic' && type === 'datetime') {
          expect(query('ion-item[aria-haspopup="dialog"]').nativeElement.getAttribute('aria-label')).toBe(label);
        } else {
          expect(query('formly-field').nativeElement.textContent).toContain(label);
        }
      }
      expect(query('.html-option')).toBeNull();
    });
  });

  it.each(['input', 'checkbox'])('sanitizes the %s label and description', (type) => {
    const unsafe = '<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">Terms</a>';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { query, queryAll } = render(type, { label: unsafe, description: unsafe, allowHtml: true, safeHtml: true });
    warn.mockRestore();

    expect(query('script')).toBeNull();
    expect(query('[onerror]')).toBeNull();
    expect(queryAll('a')).toHaveLength(2);
    queryAll('a').forEach(({ nativeElement }) => {
      expect(nativeElement.getAttribute('href')).toBe('unsafe:javascript:alert(1)');
    });
  });

  it('updates labels, descriptions, and the opt-in flag', () => {
    const { query, field, detectChanges } = render(name === 'ionic' ? 'checkbox' : 'input', { label, description });
    field.props.allowHtml = true;
    field.options.detectChanges(field);
    detectChanges();
    expect(query('.html-label')).not.toBeNull();
    expect(query('.html-description')).not.toBeNull();

    field.props.label = '<em class="updated-label">Updated label</em>';
    field.props.description = '<em class="updated-description">Updated description</em>';
    field.options.detectChanges(field);
    detectChanges();
    expect(query('.updated-label')).not.toBeNull();
    expect(query('.updated-description')).not.toBeNull();
    expect(query('.html-label')).toBeNull();

    field.props.allowHtml = false;
    field.options.detectChanges(field);
    detectChanges();
    expect(query('.updated-label')).toBeNull();
    expect(query('.updated-description')).toBeNull();
    expect(query('formly-field').nativeElement.textContent).toContain(field.props.description);
  });

  it('does not add an empty description', () => {
    const { query } = render('input', { label: '', description: '', allowHtml: true });
    expect(query('small, mat-hint, ion-note, kendo-formhint, .ant-form-item-extra')).toBeNull();
  });

  const interactiveTypes = name === 'ionic' ? ['checkbox', 'toggle', 'select', 'datetime'] : ['checkbox'];
  if (name === 'ionic' || name === 'ng-zorro-antd') {
    it.each(interactiveTypes)('keeps %s links usable without activating the control', (type) => {
      const { query, field, detectChanges } = render(type, {
        label: 'Accept <a href="#terms"><strong>terms</strong></a>',
        allowHtml: true,
      });
      field.formControl.setValue(type === 'checkbox' || type === 'toggle' ? false : null);
      detectChanges();
      const initialValue = field.formControl.value;
      const parent = query('formly-field').nativeElement;
      const onInteraction = jest.fn();
      parent.addEventListener('click', onInteraction);
      parent.addEventListener('keydown', onInteraction);
      [
        new MouseEvent('click', { bubbles: true, cancelable: true }),
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      ].forEach((event) => {
        query('a strong').nativeElement.dispatchEvent(event);
        detectChanges();
        expect(event.defaultPrevented).toBe(false);
        expect(field.formControl.value).toBe(initialValue);
        expect(onInteraction).not.toHaveBeenCalled();
      });
    });
  }

  if (name === 'material') {
    it('keeps separate hints as plain text', () => {
      const { query } = render('input', { allowHtml: true, hintStart: label, hintEnd: description });
      expect(query('.html-label, .html-description')).toBeNull();
      expect(query('formly-field').nativeElement.textContent).toContain(label);
      expect(query('formly-field').nativeElement.textContent).toContain(description);
    });
  }

  if (name === 'material' || name === 'ng-zorro-antd') {
    it.each([false, true])('preserves description templates with allowHtml=%s', (allowHtml) => {
      const { query, detectChanges } = createComponent({
        ...config,
        inputs: { allowHtml, clicks: 0 },
        template: `
          <ng-template #description><button (click)="clicks = clicks + 1">Description {{ clicks }}</button></ng-template>
          <formly-form [fields]="[{ key: 'value', type: 'input', props: { description: description, allowHtml: allowHtml } }]"></formly-form>
        `,
      });
      expect(query('button').nativeElement.textContent).toBe('Description 0');
      query('button').triggerEventHandler('click', {});
      detectChanges();
      expect(query('button').nativeElement.textContent).toBe('Description 1');
    });
  }

  if (name !== 'ionic') {
    it('preserves required markers and hidden labels', () => {
      const { query, field, detectChanges } = render('input', { label, allowHtml: true, required: true });
      const marker = name === 'ng-zorro-antd' ? 'label.ant-form-item-required' : 'label span[aria-hidden="true"]';
      expect(query(marker)).not.toBeNull();
      field.props.hideRequiredMarker = true;
      field.options.detectChanges(field);
      detectChanges();
      expect(query(marker)).toBeNull();
      expect(query('.html-label')).not.toBeNull();
      field.props.hideLabel = true;
      field.options.detectChanges(field);
      detectChanges();
      expect(query('.html-label')).toBeNull();
    });
  }

  if (name === 'material' || name === 'ionic') {
    it.each([false, true])('uses rendered text for accessible labels when hideLabel=%s', (hideLabel) => {
      const type = name === 'material' ? 'radio' : 'datetime';
      const { query, field } = render(type, { label, allowHtml: true, hideLabel });
      const control = query(name === 'material' ? 'mat-radio-group' : 'ion-item[aria-haspopup="dialog"]');
      expect(control.nativeElement.hasAttribute('aria-label')).toBe(false);
      expect(control.nativeElement.getAttribute('aria-labelledby')).toBe(field.id + '-label');
      expect(query(`[id="${field.id}-label"]`).nativeElement.textContent).toBe('Accept terms');
    });
  }
});
