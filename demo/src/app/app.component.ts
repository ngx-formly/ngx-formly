import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import APP_MENU from './app.menu.json';

@Component({
  selector: 'formly-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isSmallDevice$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map((result) => result.matches));
  menu = APP_MENU;
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
    this.documentTitle$.subscribe((title) => this.titleService.setTitle(title));
  }
}
