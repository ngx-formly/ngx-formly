import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { examplesRoutes } from '../../examples.routes';
import { CopierService } from '../../../shared/copier/copier.service';

describe('Signal model example', () => {
  it('keeps the inputs, computed name, and model preview in sync through the example route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'examples', children: examplesRoutes }]),
        provideZonelessChangeDetection(),
        CopierService,
      ],
    });
    const harness = await RouterTestingHarness.create('/examples/form-options/signal-model');
    await harness.fixture.whenStable();
    const example = harness.routeNativeElement.querySelector('formly-app-example');
    const [firstName, lastName] = example.querySelectorAll('input');
    const fullName = () => example.querySelector('strong').textContent;
    const preview = () => harness.routeNativeElement.querySelector('.json-formatter-row').textContent;

    expect(fullName()).toBe('Ada Lovelace');
    expect(preview()).toContain('Ada');

    firstName.value = 'Augusta';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));
    await harness.fixture.whenStable();
    expect(fullName()).toBe('Augusta Lovelace');
    expect(preview()).toContain('Augusta');

    example.querySelector('button').click();
    await harness.fixture.whenStable();
    expect(firstName.value).toBe('Grace');
    expect(lastName.value).toBe('Hopper');
    expect(fullName()).toBe('Grace Hopper');
    expect(preview()).toContain('Grace');
    expect(preview()).toContain('Hopper');
  });
});
