import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { examplesRoutes } from '../../examples.routes';
import { CopierService } from '../../../shared/copier/copier.service';

describe('Signal expressions example', () => {
  it('updates the field from signals without a model change through the example route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'examples', children: examplesRoutes }]),
        provideZonelessChangeDetection(),
        CopierService,
      ],
    });
    const harness = await RouterTestingHarness.create('/examples/field-options/signal-expressions');
    await harness.fixture.whenStable();
    const example = harness.routeNativeElement.querySelector('formly-app-example');
    const input = example.querySelector('input');
    const label = () => example.querySelector('label').textContent;
    const button = example.querySelector('button');

    expect(input.disabled).toBe(false);
    expect(label()).toContain('City');
    expect(label()).not.toContain('locked');

    button.click();
    await harness.fixture.whenStable();
    expect(input.disabled).toBe(true);
    expect(label()).toContain('City (locked)');

    button.click();
    await harness.fixture.whenStable();
    expect(input.disabled).toBe(false);
    expect(label()).not.toContain('locked');
  });
});
