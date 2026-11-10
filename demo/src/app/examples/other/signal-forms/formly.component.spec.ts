import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { examplesRoutes } from '../../examples.routes';
import { CopierService } from '../../../shared/copier/copier.service';

describe('Signal Forms prototype example (formly-form with signalForms)', () => {
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
    const example: HTMLElement = harness.routeNativeElement.querySelector('formly-app-example-formly');

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
    expect(groupState().value).toEqual({ age: 25 });

    button('Disabled: on').click();
    await harness.fixture.whenStable();
    expect(nameInput().disabled).toBe(false);
    expect(groupState().value).toEqual({ name: '', age: 25 });
  });
});
