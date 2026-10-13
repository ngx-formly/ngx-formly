import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';

let mockSearchLoadFails = false;
jest.mock('./shared/search/search-index', () => ({
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

  beforeEach(() => {
    mockSearchLoadFails = false;
    systemTheme = new BehaviorSubject<{ matches: boolean }>({ matches: false });
    localStorage.removeItem('formly-theme');
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: '', component: TestPageComponent },
          { path: 'guide', component: TestPageComponent },
          { path: 'guide/migration', pathMatch: 'full', redirectTo: 'guide/migration/v10' },
          { path: 'guide/migration/:id', component: TestPageComponent },
          { path: 'examples/introduction', component: TestPageComponent },
        ]),
        {
          provide: BreakpointObserver,
          useValue: {
            observe: (query: string) =>
              query === '(prefers-color-scheme: dark)' ? systemTheme : of({ matches: true }),
          },
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
    jest.restoreAllMocks();
    localStorage.removeItem('formly-theme');
    delete document.documentElement.dataset.bsTheme;
    document.documentElement.classList.remove('ion-palette-dark');
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
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.setTheme('dark');
    expect(document.documentElement.dataset.bsTheme).toBe('dark');
  });

  it('opens the mobile menu and closes it after following a section link', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();
    const drawer: MatSidenav = fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Toggle navigation"]');

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(drawer.opened).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    fixture.nativeElement.querySelector('#section-navigation a[href="/guide"]').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/guide');
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
    expect(sidebar.querySelector('a[href="/guide/migration/v10"]')).toBeNull();

    const entry = sidebar.querySelector<HTMLAnchorElement>('a[href="/guide/migration"]');
    entry.focus();
    entry.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide/migration/v10');
    expect(sidebar.querySelector('a[href="/guide/faq"]')).toBeNull();
    expect(sidebar.querySelectorAll('.menu-children a')).toHaveLength(7);
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toContain('Upgrade to v10');
    expect(drawer.opened).toBe(true);

    const back = sidebar.querySelector<HTMLAnchorElement>('[aria-label="Back to Guides"]');
    expect(document.activeElement).toBe(back);
    back.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide');
    expect(sidebar.querySelector('a[href="/guide/faq"]')).not.toBeNull();
    expect(sidebar.querySelector('.menu-children')).toBeNull();
    expect(document.activeElement).toBe(entry);
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
    await drawer.open();
    sidebar.querySelector<HTMLAnchorElement>('a[href="/guide/migration/v9"]').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/guide/migration/v9');
    expect(drawer.opened).toBe(false);
  });

  it('keeps example categories expanded', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/examples/introduction');
    fixture.detectChanges();
    await fixture.whenStable();
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('#section-navigation');
    expect(sidebar.querySelector('a[href="/examples/form-options/reset-model"]')).not.toBeNull();
    expect(sidebar.querySelector('a[href="/examples/validation/custom-validation"]')).not.toBeNull();
    expect(sidebar.querySelector('[aria-label="Back to Guides"]')).toBeNull();
  });

  it('opens search with focus in the input and restores focus when Escape closes it', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    const openSearch = jest.spyOn(fixture.componentInstance, 'openSearch');
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
    const openSearch = jest.spyOn(fixture.componentInstance, 'openSearch');
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
    await drawer.open();
    const openSearch = jest.spyOn(fixture.componentInstance, 'openSearch');
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
    const openSearch = jest.spyOn(fixture.componentInstance, 'openSearch');
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
