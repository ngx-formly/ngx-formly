import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { examplesRoutes } from '../../examples.routes';
import { CopierService } from '../../../shared/copier/copier.service';

describe('Signal Forms example', () => {
  async function render(): Promise<{
    harness: RouterTestingHarness;
    example: HTMLElement;
    button: (text: string) => HTMLButtonElement;
    groupState: () => { status: string; value: object };
    nameInput: () => HTMLInputElement;
  }> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'examples', children: examplesRoutes }]),
        provideZonelessChangeDetection(),
        CopierService,
      ],
    });
    const harness = await RouterTestingHarness.create('/examples/other/signal-forms');
    await harness.fixture.whenStable();
    const example: HTMLElement = harness.routeNativeElement.querySelector('formly-app-example');

    return {
      harness,
      example,
      button: (text) => Array.from(example.querySelectorAll('button')).find((b) => b.textContent.includes(text)),
      groupState: () => JSON.parse(example.querySelector('.formly-group-state').textContent),
      nameInput: () => example.querySelector('formly-form input'),
    };
  }

  it('updates the computed summary from the signal model when the user types', async () => {
    const { harness, example, nameInput } = await render();

    nameInput().value = 'Bob';
    nameInput().dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    expect(example.textContent).toContain('Hello Bob');
  });

  it('applies props.required as a Signal Forms rule and follows the expression', async () => {
    const { harness, example, button, groupState } = await render();
    expect(groupState().status).toBe('INVALID');

    button('Submit').click();
    await harness.fixture.whenStable();
    expect(example.querySelector('formly-validation-message').textContent).toContain('This field is required');

    button('Required: on').click();
    await harness.fixture.whenStable();
    expect(groupState().status).toBe('VALID');
    expect(example.querySelector('formly-validation-message')).toBeNull();
  });

  it('applies props.disabled as a Signal Forms rule and updates the parent', async () => {
    const { harness, button, groupState, nameInput } = await render();

    button('Disabled: off').click();
    await harness.fixture.whenStable();
    expect(nameInput().disabled).toBe(true);
    expect(groupState().value).toEqual({ age: 25, range: { start: 1, end: 5 } });

    button('Disabled: on').click();
    await harness.fixture.whenStable();
    expect(nameInput().disabled).toBe(false);
    expect(groupState().value).toEqual({ name: '', age: 25, range: { start: 1, end: 5 } });
  });

  it('hides the name field and clears its value with resetOnHide', async () => {
    const { harness, example, button, groupState, nameInput } = await render();
    nameInput().value = 'Bob';
    nameInput().dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    button('Hidden: off').click();
    await harness.fixture.whenStable();
    expect(example.querySelectorAll('formly-form input').length).toBe(3);
    expect(groupState().value).toEqual({ age: 25, range: { start: 1, end: 5 } });
    expect(example.textContent).toContain('Hello …');

    button('Hidden: on').click();
    await harness.fixture.whenStable();
    expect(example.querySelectorAll('formly-form input').length).toBe(4);
  });

  it('updates the age control on blur with modelOptions.updateOn', async () => {
    const { harness, example, groupState } = await render();
    const age: HTMLInputElement = example.querySelectorAll<HTMLInputElement>('formly-form input')[1];

    age.value = '30';
    age.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
    expect(groupState().value).toEqual({ name: '', age: 25, range: { start: 1, end: 5 } });

    age.dispatchEvent(new Event('blur'));
    await harness.fixture.whenStable();
    expect(groupState().value).toEqual({ name: '', age: 30, range: { start: 1, end: 5 } });
  });

  it('routes the range group validator error to the end field through errorPath', async () => {
    const { harness, example, button, groupState } = await render();
    button('Required: on').click();
    await harness.fixture.whenStable();
    expect(groupState().status).toBe('VALID');

    const end: HTMLInputElement = example.querySelectorAll<HTMLInputElement>('formly-form input')[3];
    end.value = '0';
    end.dispatchEvent(new Event('input'));
    end.dispatchEvent(new Event('blur'));
    await harness.fixture.whenStable();
    expect(groupState().status).toBe('INVALID');
    expect(example.querySelector('formly-validation-message').textContent).toContain('End must be greater than start');

    end.value = '9';
    end.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
    expect(groupState().status).toBe('VALID');
    expect(example.querySelector('formly-validation-message')).toBeNull();
  });

  describe('verify fixes', () => {
    type ControlsState = Record<
      'form' | 'name' | 'age',
      { status: string; errors?: object; dirty: boolean; touched: boolean }
    >;
    const controlsState = (example: HTMLElement): ControlsState =>
      JSON.parse(example.querySelector('.formly-controls-state').textContent);
    const events = (example: HTMLElement): string[] => JSON.parse(example.querySelector('.formly-events').textContent);

    it('keeps the form error when the age error is set and cleared', async () => {
      const { harness, example, button } = await render();

      for (const text of ['Set form error', 'Set age error', 'Clear age error']) {
        button(text).click();
        await harness.fixture.whenStable();
      }

      expect(controlsState(example).form).toMatchObject({ status: 'INVALID', errors: { server: true } });
      expect(controlsState(example).age).toMatchObject({ status: 'VALID', errors: null });
    });

    it('keeps the age state when the name is reset', async () => {
      const { harness, example, button } = await render();
      // Only a name that changes back to pristine and untouched reset its siblings.
      const [name, age] = Array.from(example.querySelectorAll<HTMLInputElement>('formly-form input'));
      for (const [input, value] of [
        [name, 'Bob'],
        [age, '30'],
      ] as const) {
        input.value = value;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
      }
      await harness.fixture.whenStable();

      button('Reset name').click();
      await harness.fixture.whenStable();

      expect(controlsState(example).age).toMatchObject({ dirty: true, touched: true });
      expect(controlsState(example).form).toMatchObject({ dirty: true, touched: true });
    });

    it('disables the name reset while the name is hidden', async () => {
      const { harness, button } = await render();
      expect(button('Reset name').disabled).toBe(false);

      button('Hidden: off').click();
      await harness.fixture.whenStable();
      expect(button('Reset name').disabled).toBe(true);

      button('Hidden: on').click();
      await harness.fixture.whenStable();
      expect(button('Reset name').disabled).toBe(false);
    });

    it('does not emit when the age is revalidated silently', async () => {
      const { harness, example, button } = await render();
      button('Set age error').click();
      await harness.fixture.whenStable();
      button('Clear log').click();
      await harness.fixture.whenStable();

      button('Revalidate age silently').click();
      await harness.fixture.whenStable();

      expect(controlsState(example).age.status).toBe('VALID');
      expect(events(example)).toEqual([]);
    });
  });
});
