import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { examplesRoutes } from '../../examples.routes';
import { CopierService } from '../../../shared/copier/copier.service';

describe('Signal Forms prototype example', () => {
  async function render() {
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
    const button = (text: string) =>
      Array.from(example.querySelectorAll('button')).find((b) => b.textContent.includes(text));

    return { harness, example, button, input: example.querySelector('input') };
  }

  it('updates the computed summary when the user types', async () => {
    const { harness, example, input } = await render();

    input.value = 'Bob';
    input.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    expect(example.textContent).toContain('Hello Bob');
  });

  it('shows the required error after submit and clears it on external update', async () => {
    const { harness, example, button } = await render();

    button('Submit').click();
    await harness.fixture.whenStable();
    expect(example.textContent).toContain('Name is required');

    button('Set "Alice" externally').click();
    await harness.fixture.whenStable();
    expect(example.textContent).not.toContain('Name is required');
    expect(example.textContent).toContain('Hello Alice');
  });

  it('drops the required error when the required rule is switched off at runtime', async () => {
    const { harness, example, button } = await render();

    button('Submit').click();
    await harness.fixture.whenStable();
    expect(example.textContent).toContain('Name is required');

    button('Required: on').click();
    await harness.fixture.whenStable();
    expect(example.textContent).not.toContain('Name is required');
    expect(example.querySelector('label').textContent).not.toContain('*');
  });

  it('shows expected vs actual after toggling the rules (documents the missing parent update)', async () => {
    const { harness, example, button } = await render();
    const rows = () =>
      Array.from(example.querySelectorAll('tbody tr')).map((tr) =>
        Array.from(tr.children).map((c) => c.textContent.trim().replace(/\s+/g, ' ')),
      );

    button('Required: on').click();
    await harness.fixture.whenStable();
    const afterRequiredOff = rows();

    button('Disabled: off').click();
    await harness.fixture.whenStable();
    const afterDisabledOn = rows();

    expect({ afterRequiredOff, afterDisabledOn }).toMatchSnapshot();
  });

  it('disables the input through the disabled rule and back', async () => {
    const { harness, button, input } = await render();
    expect(input.disabled).toBe(false);

    button('Disabled: off').click();
    await harness.fixture.whenStable();
    expect(input.disabled).toBe(true);

    button('Disabled: on').click();
    await harness.fixture.whenStable();
    expect(input.disabled).toBe(false);
  });
});
