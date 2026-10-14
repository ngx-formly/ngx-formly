import {
  Component,
  OnInit,
  OnDestroy,
  Injector,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DOCUMENT, Location, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import APP_MENU from './app.menu.json';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  migrationMenu = this.menu
    .find((section) => section.path === '/guide')
    .items.find((item) => item.path === '/guide/migration');
  migrationMenuActive$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      this.router.isActive(this.migrationMenu.path, {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      }),
    ),
  );
  menuIcons: Record<string, string> = { '/guide': 'menu_book', '/ui': 'dashboard', '/examples': 'code' };
  usDefaultLayout = !this.location.path().includes('embeddedview=true');
  documentTitle$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects),
    map((currentUrl) => {
      const sidebarLinks = this.menu.flatMap((group) =>
        group.items.flatMap((group: any) => (group.items ? group.items : group)),
      );
      const activeLink = sidebarLinks.find((link: any) => link.path === currentUrl);
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
