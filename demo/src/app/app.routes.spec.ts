import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Published documentation URLs', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  it.each([
    ['/docs/api/core?source=old#formlyformbuilder', '/api/core?source=old#formlyformbuilder', 'FormlyFormBuilder'],
    ['/docs/api/core/json-schema/', '/api/core/json-schema', 'FormlyJsonschema'],
    ['/docs/api/ui/material/select/', '/api/ui/material/select', 'FormlyFieldSelect'],
    ['/docs/api/schematics/', '/api/schematics', 'ng-add'],
    ['/docs/guide/properties-options#fields', '/guide/properties-options#fields', 'Properties and Options'],
  ])('preserves %s', async (oldUrl, currentUrl, title) => {
    const harness = await RouterTestingHarness.create(oldUrl);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(currentUrl);
    expect(harness.routeNativeElement.querySelector('article').textContent).toContain(title);
    const fragment = TestBed.inject(Router).parseUrl(currentUrl).fragment;
    if (fragment) expect(document.activeElement?.id).toBe(fragment);
  });
});
