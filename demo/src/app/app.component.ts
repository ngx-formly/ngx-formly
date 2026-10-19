import {
  Component,
  OnInit,
  OnDestroy,
  Injector,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT, Location, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_MENU, MenuItem, menuAncestors, menuPages } from './app.menu';
import { version } from '../../../package.json';

import { Subject } from 'rxjs';
import { NgxLoadingBar } from '@ngx-loading-bar/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

@Component({
  selector: 'formly-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { '(document:keydown)': 'onSearchShortcut($event)' },
  imports: [
    NgxLoadingBar,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterOutlet,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private injector = inject(Injector);
  private sidenav = viewChild(MatSidenav);
  private sectionMenu = viewChild<ElementRef<HTMLElement>>('sectionMenu');
  readonly searchLoading = signal(false);
  readonly searchFailed = signal(false);
  readonly searchShortcut = this.document.defaultView?.navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
  private systemDark = false;
  readonly theme = signal<'system' | 'dark' | 'light'>('system');
  readonly themeOptions = [
    { value: 'system', label: 'System', icon: 'brightness_6' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'light', label: 'Light', icon: 'light_mode' },
  ] as const;
  private destroy$: Subject<any> = new Subject<any>();
  isSmallDevice$ = this.breakpointObserver.observe('(max-width: 767px)').pipe(map((result) => result.matches));
  menu = APP_MENU;
  readonly menuPath = signal<MenuItem[]>([]);
  readonly activeMenuPath = signal<MenuItem[]>([]);
  readonly currentVersion = `v${version.split('.')[0]}`;
  get versions(): string[] {
    const versions = this.menu
      .find((section) => section.path === '/guide')
      .items.find((item) => item.path === '/guide/migration')
      .items.slice(0, 3)
      .map(({ path }) => path.split('/').pop());

    return [versions[0], versions[1], versions.includes(this.currentVersion) ? versions[2] : this.currentVersion];
  }
  menuIcons: Record<string, string> = {
    '/guide': 'menu_book',
    '/ui': 'dashboard',
    '/examples': 'code',
    '/api': 'data_object',
  };
  usDefaultLayout = !this.location.path().includes('embeddedview=true');
  documentTitle$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects),
    map((currentUrl) => {
      const activeLink = menuPages(this.menu).find((link) => link.path === currentUrl.split(/[?#]/)[0]);
      const label = activeLink?.label;

      const baseTitle = 'Angular Formly';
      return label ? `${baseTitle} - ${label}` : baseTitle;
    }),
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private location: Location,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const path = menuAncestors(this.menu, this.router.url.split(/[?#]/)[0]) ?? [];
        this.activeMenuPath.set(path);
        this.menuPath.set(path);
      });
    try {
      const saved = this.document.defaultView?.localStorage.getItem('formly-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        this.theme.set(saved);
      }
    } catch {
      // Browsers can block storage; theme switching still works for this visit.
    }
    this.breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ matches }) => {
        this.systemDark = matches;
        this.applyTheme();
      });
    this.documentTitle$.pipe(takeUntil(this.destroy$)).subscribe((title) => this.titleService.setTitle(title));
  }

  openMenu(item: MenuItem): void {
    this.showMenu([...this.menuPath(), item]);
  }

  backMenu(): void {
    this.showMenu(this.menuPath().slice(0, -1));
  }

  private showMenu(path: MenuItem[]): void {
    const previous = this.menuPath().at(-1);
    const goingBack = path.length < this.menuPath().length;
    this.menuPath.set(path);
    afterNextRender(
      () => {
        const menu = this.sectionMenu()?.nativeElement;
        const target = goingBack
          ? Array.from(menu?.querySelectorAll<HTMLButtonElement>('[data-menu-label]') ?? []).find(
              (button) => button.dataset.menuLabel === previous.label,
            )
          : menu?.querySelector<HTMLButtonElement>('.menu-back');
        target?.focus();
        menu?.parentElement.scrollTo({ top: 0 });
      },
      { injector: this.injector },
    );
  }

  setTheme(theme: 'system' | 'dark' | 'light'): void {
    this.theme.set(theme);
    this.applyTheme();
    try {
      this.document.defaultView?.localStorage.setItem('formly-theme', theme);
    } catch {
      // Keep the selected theme even when the browser cannot remember it.
    }
  }

  async openSearch(): Promise<void> {
    if (this.searchLoading()) {
      return;
    }
    this.searchLoading.set(true);
    this.searchFailed.set(false);
    try {
      if (this.sidenav()?.mode === 'over') {
        await this.sidenav().close();
      }
      const [{ MatDialog }, { SearchComponent }] = await Promise.all([
        import('@angular/material/dialog'),
        import('./shared/search/search.component'),
      ]);
      const dialog = this.injector.get(MatDialog);
      if (dialog.getDialogById('documentation-search')) {
        return;
      }
      dialog.open(SearchComponent, {
        id: 'documentation-search',
        ariaLabel: 'Search documentation',
        autoFocus: 'input',
        width: '720px',
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'documentation-search-panel',
      });
    } catch {
      this.searchFailed.set(true);
    } finally {
      this.searchLoading.set(false);
    }
  }

  onSearchShortcut(event: KeyboardEvent): void {
    if (this.usDefaultLayout && (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  private applyTheme(): void {
    const theme = this.theme() === 'system' ? (this.systemDark ? 'dark' : 'light') : this.theme();
    this.document.documentElement.dataset.bsTheme = theme;
    this.document.documentElement.classList.toggle('ion-palette-dark', theme === 'dark');
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
