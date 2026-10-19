import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { version } from '../../../package.json';

let mockSearchLoadFails = false;
vi.mock('./shared/search/search-index', () => ({
  get SEARCH_INDEX() {
    if (mockSearchLoadFails) {
      throw new Error('Search chunk unavailable');
    }
    return [
      { title: 'Getting Started', path: '/guide', category: 'Guides', content: 'Install Formly.' },
      { title: 'Upgrade to v9', path: '/guide/migration/v9', category: 'Migration guides', content: 'Upgrade Formly.' },
    ];
  },
}));

@Component({ selector: 'formly-test-page', template: '' })
class TestPageComponent {}

describe('Website navigation', () => {
  let systemTheme: BehaviorSubject<{ matches: boolean }>;
  let smallDevice: BehaviorSubject<{ matches: boolean }>;

  beforeEach(() => {
    mockSearchLoadFails = false;
    smallDevice = new BehaviorSubject({ matches: true });
    systemTheme = new BehaviorSubject<{ matches: boolean }>({ matches: false });
    localStorage.removeItem('formly-theme');
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: '', component: TestPageComponent },
          { path: 'guide', component: TestPageComponent },
          { path: 'guide/getting-started', component: TestPageComponent },
          { path: 'guide/migration', pathMatch: 'full', redirectTo: 'guide/migration/v11' },
          { path: 'guide/migration/:id', component: TestPageComponent },
          { path: 'examples/introduction', component: TestPageComponent },
          { path: 'examples/form-options/reset-model', component: TestPageComponent },
          { path: 'api/core', component: TestPageComponent },
          { path: 'api/core/json-schema', component: TestPageComponent },
        ]),
        {
          provide: BreakpointObserver,
          useValue: {
            observe: (query: string) => (query === '(prefers-color-scheme: dark)' ? systemTheme : smallDevice),
          },
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
    vi.restoreAllMocks();
    localStorage.removeItem('formly-theme');
    delete document.documentElement.dataset.bsTheme;
    document.documentElement.classList.remove('ion-palette-dark');
  });

  it('shows the package version and exposes API pages in navigation', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await TestBed.inject(Router).navigateByUrl('/api/core#formlyformbuilder');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.nav-version').textContent).toContain(`v${version.split('.')[0]}`);
    expect(fixture.nativeElement.querySelector('.primary-links a[href="/api"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.site-footer a[href="/api"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#section-navigation a[href="/api/core/json-schema"]')).not.toBeNull();
    expect(document.title).toBe('Angular Formly - Core');
  });

  it.each([
    ['v11', ['v11 (current)', 'v10', 'v9']],
    ['v10', ['v11 (latest)', 'v10 (current)', 'v9']],
    ['v9', ['v11 (latest)', 'v10', 'v9 (current)']],
    ['v6', ['v11 (latest)', 'v10', 'v6 (current)']],
  ])('orders the version menu with %s selected and migration guides last', async (currentVersion, labels) => {
    const fixture = TestBed.createComponent(AppComponent);
    Object.defineProperty(fixture.componentInstance, 'currentVersion', { value: currentVersion });
    fixture.autoDetectChanges();
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.nav-version button').click();
    await fixture.whenStable();

    const items = [...document.querySelectorAll<HTMLAnchorElement>('[role="menu"] [role="menuitem"]')];
    expect(items.map((item) => item.textContent.trim())).toEqual([...labels, 'Migration guides']);
    expect(items[0].getAttribute('href')).toBe('https://formly.dev/');
    expect(items[1].getAttribute('href')).toBe('https://v10.formly.dev/');
    expect(items[2].getAttribute('href')).toBe(`https://${currentVersion === 'v6' ? 'v6' : 'v9'}.formly.dev/`);
    expect(
      items.filter((item) => item.getAttribute('aria-disabled') === 'true').map((item) => item.textContent.trim()),
    ).toEqual([`${currentVersion} (current)`]);

    items[3].click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/guide/migration/v11');
  });

  it('selects a theme from the menu and remembers it when the app starts again', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.theme-toggle').click();
    fixture.detectChanges();
    await fixture.whenStable();

    const darkOption = [...document.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')].find((option) =>
      option.textContent.includes('Dark'),
    );
    darkOption.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(true);
    expect(localStorage.getItem('formly-theme')).toBe('dark');
    expect(fixture.nativeElement.querySelector('.theme-toggle').getAttribute('aria-label')).toContain('dark');
    fixture.destroy();

    const reloaded = TestBed.createComponent(AppComponent);
    reloaded.detectChanges();
    expect(reloaded.componentInstance.theme()).toBe('dark');
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
  });

  it('follows system changes only when System is selected', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(document.documentElement.dataset.bsTheme).toBe('light');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBe(false);

    systemTheme.next({ matches: true });
    expect(document.documentElement.dataset.bsTheme).toBe('dark');

    fixture.componentInstance.setTheme('light');
    systemTheme.next({ matches: false });
    systemTheme.next({ matches: true });
    expect(document.documentElement.dataset.bsTheme).toBe('light');

    fixture.componentInstance.setTheme('system');
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
    fixture.destroy();
    systemTheme.next({ matches: false });
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
  });

  it('uses the system theme for an invalid saved preference', () => {
    localStorage.setItem('formly-theme', 'invalid');
    systemTheme.next({ matches: true });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.theme()).toBe('system');
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
  });

  it('still switches themes when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.setTheme('dark');
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
  });

  it('keeps the mobile menu open through sections and closes it after following a page link', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Toggle navigation"]');

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(drawer.opened).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    fixture.nativeElement.querySelector('[data-menu-label="Guides"]').click();
    await fixture.whenStable();
    expect(drawer.opened).toBe(true);
    expect(TestBed.inject(Router).url).toBe('/');
    expect(fixture.nativeElement.querySelector('[aria-label="Back to sections"]')).not.toBeNull();

    fixture.nativeElement.querySelector('#section-navigation a[href="/guide/getting-started"]').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/guide/getting-started');
    expect(drawer.opened).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('skips navigation without leaving the current guide', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/guide');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.skip-link').click();
    expect(document.activeElement?.id).toBe('main-content');
    expect(TestBed.inject(Router).url).toBe('/guide');
  });

  it('opens the migration list on demand and returns to Guides without closing the mobile drawer', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/guide');
    fixture.detectChanges();
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    await drawer.open();
    fixture.detectChanges();
    expect(sidebar.querySelector('a[href="/guide/migration/v11"]')).toBeNull();

    const entry = sidebar.querySelector<HTMLButtonElement>('[data-menu-label="Migration guides"]');
    entry.focus();
    entry.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide');
    expect(sidebar.querySelector('a[href="/guide/faq"]')).toBeNull();
    expect(sidebar.querySelectorAll('.menu-children a')).toHaveLength(8);
    expect(sidebar.querySelector('[aria-current="page"]')).toBeNull();
    expect(drawer.opened).toBe(true);

    const back = sidebar.querySelector<HTMLButtonElement>('[aria-label="Back to Guides"]');
    expect(document.activeElement).toBe(back);
    back.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide');
    expect(sidebar.querySelector('a[href="/guide/faq"]')).not.toBeNull();
    expect(sidebar.querySelector('.menu-children')).toBeNull();
    expect(document.activeElement).toBe(sidebar.querySelector('[data-menu-label="Migration guides"]'));
    expect(drawer.opened).toBe(true);
  });

  it('shows the migration list for a direct link and closes the mobile drawer after choosing a version', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/guide/migration/v6#changes');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    expect(sidebar.querySelector('[aria-label="Back to Guides"]')).not.toBeNull();
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toContain('Upgrade to v6');

    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    await fixture.ngZone.run(() => drawer.open());
    sidebar.querySelector<HTMLAnchorElement>('a[href="/guide/migration/v9"]').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide/migration/v9');
    expect(drawer.opened).toBe(false);
  });

  it('opens example categories independently of the current page and restores the active parent', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/examples/introduction');
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    expect(sidebar.querySelector('a[href="/examples/introduction"]')).not.toBeNull();
    expect(sidebar.querySelector('a[href="/examples/form-options/reset-model"]')).toBeNull();

    sidebar.querySelector<HTMLButtonElement>('[aria-label="Back to Examples"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('.active-link')?.textContent).toContain('Intro');
    expect(document.activeElement).toBe(sidebar.querySelector('[data-menu-label="Intro"]'));
    sidebar.querySelector<HTMLButtonElement>('[data-menu-label="Form Options"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('a[href="/examples/form-options/reset-model"]')).not.toBeNull();
    expect(sidebar.querySelector('a[href="/examples/validation/custom-validation"]')).toBeNull();
    expect(sidebar.querySelector('a[href="/examples/introduction"]')).toBeNull();
    expect(router.url).toBe('/examples/introduction');

    sidebar.querySelector<HTMLAnchorElement>('a[href="/examples/form-options/reset-model"]').click();
    await fixture.whenStable();
    expect(router.url).toBe('/examples/form-options/reset-model');
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toContain('Reset Model');
  });

  it('opens the correct API group for direct links, including query parameters and headings', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/api/core/json-schema?view=reference#formlyjsonschema');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toContain('JSON Schema');
    expect(sidebar.querySelector('a[href="/api/ui/bootstrap"]')).toBeNull();

    sidebar.querySelector<HTMLButtonElement>('[aria-label="Back to API"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('[data-menu-label="Core"].active-link')).not.toBeNull();
    expect(sidebar.querySelector('a[href="/api/core/json-schema"]')).toBeNull();
    sidebar.querySelector<HTMLButtonElement>('[data-menu-label="Bootstrap"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('a[href="/api/ui/bootstrap/input"]')).not.toBeNull();
    expect(router.url).toBe('/api/core/json-schema?view=reference#formlyjsonschema');

    await router.navigateByUrl('/guide/migration/v9');
    await fixture.whenStable();
    expect(sidebar.querySelector('[aria-label="Back to Guides"]')).not.toBeNull();
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toContain('Upgrade to v9');
  });

  it('returns to the mobile section list so another section can be browsed', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await TestBed.inject(Router).navigateByUrl('/guide');
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    await drawer.open();
    sidebar.querySelector<HTMLButtonElement>('[aria-label="Back to sections"]').click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(sidebar.querySelector('[data-menu-label="Guides"]'));
    sidebar.querySelector<HTMLButtonElement>('[data-menu-label="API"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('[data-menu-label="Core"]')).not.toBeNull();
    expect(sidebar.querySelector('a[href="/guide/faq"]')).toBeNull();
    expect(drawer.opened).toBe(true);
  });

  it('shows only the current section on desktop and supports returning from its children', async () => {
    smallDevice.next({ matches: false });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await TestBed.inject(Router).navigateByUrl('/guide/migration/v6');
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    sidebar.querySelector<HTMLButtonElement>('[aria-label="Back to Guides"]').click();
    await fixture.whenStable();
    expect(sidebar.querySelector('.menu-back')).toBeNull();
    expect(sidebar.querySelector('[data-menu-label="Migration guides"].active-link')).not.toBeNull();
    expect(sidebar.querySelector('[data-menu-label="API"]')).toBeNull();
    expect(sidebar.querySelector('a[href="/guide/faq"]')).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(MatSidenav)).componentInstance.opened).toBe(true);
  });

  it('opens search with focus in the input and restores focus when Escape closes it', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const openSearch = vi.spyOn(fixture.componentInstance, 'openSearch');
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.search-toggle');
    trigger.focus();
    trigger.click();
    await openSearch.mock.results[0].value;
    await fixture.whenStable();
    const input = document.querySelector<HTMLInputElement>('[role="dialog"] input');
    expect(document.activeElement).toBe(input);
    expect(document.querySelector('[role="dialog"]').textContent).toContain('Search Formly documentation');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    await fixture.whenStable();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it.each(['metaKey', 'ctrlKey'])('opens only one search dialog using %s + K', async (modifier) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const openSearch = vi.spyOn(fixture.componentInstance, 'openSearch');
    const key = () => new KeyboardEvent('keydown', { key: 'k', [modifier]: true, bubbles: true, cancelable: true });
    const event = key();
    document.dispatchEvent(event);
    document.dispatchEvent(key());
    await openSearch.mock.results[0].value;
    await fixture.whenStable();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('navigates results with arrow keys and opens the first result with Enter', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    await fixture.ngZone.run(() => drawer.open());
    const openSearch = vi.spyOn(fixture.componentInstance, 'openSearch');
    fixture.nativeElement.querySelector('.search-toggle').click();
    await openSearch.mock.results[0].value;
    await fixture.whenStable();
    expect(drawer.opened).toBe(false);
    const input = document.querySelector<HTMLInputElement>('[role="dialog"] input');
    input.value = 'Formly';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    const links = document.querySelectorAll<HTMLAnchorElement>('[aria-label="Search results"] a');
    expect(links).toHaveLength(2);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(links[0]);
    links[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(links[1]);
    links[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(input);

    input.value = 'v9';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/guide/migration/v9');
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows an empty result state and can recover when the search index fails to load', async () => {
    mockSearchLoadFails = true;
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const openSearch = vi.spyOn(fixture.componentInstance, 'openSearch');
    fixture.nativeElement.querySelector('.search-toggle').click();
    await openSearch.mock.results[0].value;
    await fixture.whenStable();
    expect(document.querySelector('[role="dialog"]').textContent).toContain("Search couldn't load");

    mockSearchLoadFails = false;
    document.querySelector<HTMLButtonElement>('.search-state button').click();
    await fixture.whenStable();
    const input = document.querySelector<HTMLInputElement>('[role="dialog"] input');
    input.value = 'nonexistent';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(document.querySelector('[role="dialog"]').textContent).toContain('No results for');
    expect(document.querySelector('[aria-label="Search results"] a')).toBeNull();
  });
});
