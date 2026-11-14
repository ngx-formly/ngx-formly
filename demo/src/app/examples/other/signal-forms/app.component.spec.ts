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
    expect(example.querySelector('formly-validation-message')).not.toBeNull();

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
});
