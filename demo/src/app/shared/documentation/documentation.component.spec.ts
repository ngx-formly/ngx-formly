import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DocumentationComponent } from './documentation.component';
import { CopierService } from '../copier/copier.service';

const pages = [
  {
    path: '/guide/first',
    title: 'First',
    source: 'docs/first.md',
    content:
      '# First\n\n## Read this\n\n[Second](docs/second.md)\n\n```ts\nconst value = "<example>";\n```\n\n### Details\n\nMore information.\n\n## Last section\n\nEnd.',
  },
  {
    path: '/guide/second',
    title: 'Second',
    source: 'docs/second.md',
    content: '# Second\n\n## Other heading\n\nAnother page.',
  },
];

describe('Documentation reader', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'guide/:id', component: DocumentationComponent, data: { pages } }])],
    }),
  );

  it('renders the table of contents, permalinks, source and adjacent pages, and updates them on navigation', async () => {
    const harness = await RouterTestingHarness.create('/guide/first#read-this');
    harness.fixture.autoDetectChanges();
    await harness.fixture.whenStable();
    const reader = harness.routeNativeElement;
    expect(reader.querySelector('h2 .heading-link').getAttribute('href')).toBe('/guide/first#read-this');
    expect(reader.querySelector('nav[aria-label="On this page"] a').textContent).toBe('Read this');
    expect(reader.querySelector('nav[aria-label="On this page"] a').getAttribute('href')).toBe(
      '/guide/first#read-this',
    );
    expect(reader.querySelector('.edit-page').getAttribute('href')).toContain('/edit/main/docs/first.md');
    expect(reader.querySelector('.page-navigation').textContent).not.toContain('Previous');
    expect(reader.querySelector('.next-page').getAttribute('href')).toBe('/guide/second');
    expect(document.activeElement?.id).toBe('read-this');

    reader.querySelector<HTMLAnchorElement>('article a[href="/guide/second"]').click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/guide/second');
    expect(reader.querySelector('article').textContent).not.toContain('Read this');
    expect(reader.querySelector('.page-navigation').textContent).toContain('Previous');
    expect(reader.querySelector('.next-page')).toBeNull();
    expect(reader.querySelector('nav[aria-label="On this page"]').textContent).toContain('Other heading');
  });

  it('copies the original code, announces success and offers recovery when copying fails', async () => {
    const harness = await RouterTestingHarness.create('/guide/first');
    harness.fixture.autoDetectChanges();
    await harness.fixture.whenStable();
    const copier = harness.routeDebugElement.injector.get(CopierService);
    const copy = vi.spyOn(copier, 'copyText').mockReturnValue(true);
    const button = harness.routeNativeElement.querySelector<HTMLButtonElement>('.copy-code');
    button.click();
    await harness.fixture.whenStable();
    expect(copy).toHaveBeenCalledWith('const value = "<example>";\n');
    expect(harness.routeNativeElement.querySelector('[role="status"]').textContent).toContain('Code copied');
    expect(document.activeElement).toBe(button);

    copy.mockReturnValue(false);
    button.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement.querySelector('[role="status"]').textContent).toContain('Select the code');
    expect(button.textContent).toBe('Try again');
  });

  it('marks only the current heading while scrolling down and up, including the end of the page', async () => {
    const harness = await RouterTestingHarness.create();
    harness.fixture.autoDetectChanges();
    const scroller = document.createElement('mat-sidenav-content');
    document.body.append(scroller);
    scroller.append(harness.fixture.nativeElement);
    await harness.navigateByUrl('/guide/first');
    const reader = harness.routeNativeElement;
    await harness.fixture.whenStable();
    const headings = [...reader.querySelectorAll<HTMLElement>('article h2, article h3')];
    let scrollTop = 0;
    vi.spyOn(scroller, 'getBoundingClientRect').mockReturnValue({ top: 64 } as DOMRect);
    vi.spyOn(scroller, 'scrollTop', 'get').mockImplementation(() => scrollTop);
    vi.spyOn(scroller, 'clientHeight', 'get').mockReturnValue(600);
    vi.spyOn(scroller, 'scrollHeight', 'get').mockReturnValue(2400);
    [200, 1000, 2000].forEach((top, index) => {
      vi.spyOn(headings[index], 'getBoundingClientRect').mockImplementation(
        () => ({ top: top - scrollTop }) as DOMRect,
      );
    });

    for (const [position, id] of [
      [0, 'read-this'],
      [920, 'details'],
      [1500, 'details'],
      [1800, 'last-section'],
      [200, 'read-this'],
    ] as const) {
      scrollTop = position;
      scroller.dispatchEvent(new Event('scroll'));
      await harness.fixture.whenStable();
      for (const nav of reader.querySelectorAll('nav[aria-label="On this page"]')) {
        const active = nav.querySelectorAll('[aria-current="location"]');
        expect(active).toHaveLength(1);
        expect(active[0].getAttribute('href')).toBe(`/guide/first#${id}`);
      }
    }

    await harness.navigateByUrl('/guide/second');
    await harness.fixture.whenStable();
    expect(reader.querySelector('[aria-current="location"]').getAttribute('href')).toBe('/guide/second#other-heading');
    const removeListener = vi.spyOn(scroller, 'removeEventListener');
    harness.fixture.destroy();
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    scroller.remove();
  });

  it('returns to the top and focuses the title even when there is no fragment', async () => {
    const harness = await RouterTestingHarness.create('/guide/first?mode=example#details');
    harness.fixture.autoDetectChanges();
    await harness.fixture.whenStable();
    const reader = harness.routeNativeElement;
    const scroller = document.createElement('mat-sidenav-content');
    harness.fixture.nativeElement.append(scroller);
    scroller.append(reader);
    const scrollTo = vi.spyOn(scroller, 'scrollTo');

    for (let click = 0; click < 2; click++) {
      reader.querySelector<HTMLButtonElement>('.back-to-top').click();
      await harness.fixture.whenStable();
      expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
      expect(document.activeElement).toBe(reader.querySelector('h1'));
      expect(TestBed.inject(Router).url).toBe('/guide/first?mode=example');
      scrollTo.mockClear();
    }
  });

  it('renders a useful missing-page state instead of stale content', async () => {
    const harness = await RouterTestingHarness.create('/guide/first');
    harness.fixture.autoDetectChanges();
    await harness.navigateByUrl('/guide/missing');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement.textContent).toContain('Page not found');
    expect(harness.routeNativeElement.querySelector('article').textContent).toBe('');
    expect(harness.routeNativeElement.querySelector('.page-navigation')).toBeNull();
    expect(harness.routeNativeElement.querySelector('.mobile-toc')).toBeNull();
    expect(harness.routeNativeElement.querySelector('.desktop-toc')).toBeNull();
  });
});
