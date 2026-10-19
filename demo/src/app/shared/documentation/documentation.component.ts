import { Component, ElementRef, afterRenderEffect, computed, inject, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { CopierService } from '../copier/copier.service';
import { renderMarkdown } from '../highlight';
import { DocumentationPage } from './documentation';

@Component({
  imports: [NgTemplateOutlet, RouterLink, MatIcon],
  providers: [CopierService],
  host: { '(click)': 'onContentClick($event)' },
  selector: 'formly-documentation',
  styleUrl: './documentation.component.scss',
  templateUrl: './documentation.component.html',
})
export class DocumentationComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private copier = inject(CopierService);
  private article = viewChild.required<ElementRef<HTMLElement>>('article');
  private fragment = toSignal(this.route.fragment);
  readonly pages = this.route.snapshot.data['pages'] as DocumentationPage[];
  readonly page = signal<DocumentationPage | undefined>(undefined);
  readonly headings = signal<{ id: string; title: string; level: number }[]>([]);
  readonly activeHeading = signal<string | undefined>(undefined);
  readonly copyStatus = signal('');
  readonly previous = computed(() => this.pages[this.pages.indexOf(this.page()) - 1]);
  readonly next = computed(() => this.page() && this.pages[this.pages.indexOf(this.page()) + 1]);
  readonly editUrl = computed(() => `https://github.com/ngx-formly/ngx-formly/edit/main/${this.page()?.source}`);

  constructor() {
    this.route.url.pipe(takeUntilDestroyed()).subscribe(() => {
      const path =
        '/' +
        this.route.pathFromRoot
          .flatMap((route) => route.snapshot.url.map((part) => part.path))
          .filter(Boolean)
          .join('/');
      this.page.set(this.pages.find((page) => page.path === path));
    });
    afterRenderEffect((onCleanup) => {
      const page = this.page();
      const article = this.article().nativeElement;
      // Markdown is bundled from repository sources, including the guides' embedded examples.
      article.innerHTML = page
        ? renderMarkdown(page.content)
            .replace(/href="docs\/([^"#]+)\.md/g, 'href="/guide/$1')
            .replace(/href="#/g, `href="${page.path}#`)
        : '';
      const headings = [...article.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id], h4[id]')];
      const tocHeadings = headings.filter((heading) => heading.tagName === 'H2' || heading.tagName === 'H3');
      this.headings.set(
        tocHeadings.map((heading) => ({
          id: heading.id,
          title: heading.textContent,
          level: Number(heading.tagName.slice(1)),
        })),
      );
      headings.forEach((heading) => {
        const link = article.ownerDocument.createElement('a');
        link.href = `${page.path}#${heading.id}`;
        link.className = 'heading-link';
        link.textContent = '#';
        link.setAttribute('aria-label', `Link to ${heading.textContent}`);
        heading.tabIndex = -1;
        heading.append(link);
      });
      article.querySelectorAll('pre').forEach((pre, index) => {
        const wrapper = article.ownerDocument.createElement('div');
        wrapper.className = 'doc-code';
        pre.before(wrapper);
        wrapper.append(pre);
        const button = article.ownerDocument.createElement('button');
        button.type = 'button';
        button.className = 'copy-code';
        button.dataset.copyCode = '';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', `Copy code block ${index + 1}`);
        wrapper.append(button);
      });
      this.copyStatus.set('');
      const scroller = article.closest('mat-sidenav-content');
      const window = article.ownerDocument.defaultView;
      const updateActiveHeading = () => {
        let active = tocHeadings[0];
        const top = (scroller?.getBoundingClientRect().top ?? 0) + 32;
        for (const heading of tocHeadings) {
          if (heading.getBoundingClientRect().top > top) break;
          active = heading;
        }
        if (scroller?.scrollTop > 0 && Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight) {
          active = tocHeadings.at(-1);
        }
        this.activeHeading.set(active?.id);
      };
      updateActiveHeading();
      scroller?.addEventListener('scroll', updateActiveHeading, { passive: true });
      window?.addEventListener('resize', updateActiveHeading);
      onCleanup(() => {
        scroller?.removeEventListener('scroll', updateActiveHeading);
        window?.removeEventListener('resize', updateActiveHeading);
      });
    });
    afterRenderEffect(() => {
      const fragment = this.fragment();
      this.page();
      const article = this.article().nativeElement;
      if (fragment) {
        this.scrollToHeading(fragment);
      } else {
        article.closest('mat-sidenav-content')?.scrollTo({ top: 0 });
      }
    });
  }

  backToTop(): void {
    const article = this.article().nativeElement;
    article.closest('mat-sidenav-content')?.scrollTo({ top: 0 });
    article.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    this.router.navigate([], { relativeTo: this.route, queryParamsHandling: 'preserve', replaceUrl: true });
  }

  private scrollToHeading(fragment: string): void {
    const target = [...this.article().nativeElement.querySelectorAll<HTMLElement>('[id]')].find(
      (element) => element.id === fragment,
    );
    target?.scrollIntoView({ block: 'start' });
    target?.focus({ preventScroll: true });
  }

  onContentClick(event: MouseEvent): void {
    const target = event.target as Element;
    const button = target.closest<HTMLButtonElement>('button[data-copy-code]');
    if (button) {
      let copied = false;
      try {
        copied = this.copier.copyText(button.parentElement.querySelector('code').textContent);
      } catch {
        // Clipboard access may be unavailable; the code remains selectable.
      }
      this.copyStatus.set(
        copied ? 'Code copied to clipboard.' : 'Could not copy. Select the code and copy it manually.',
      );
      button.textContent = copied ? 'Copied' : 'Try again';
      button.focus();
    }
    const link = target.closest<HTMLAnchorElement>('a[href]');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute('download')
    )
      return;
    const url = new URL(link.href);
    if (url.origin === link.ownerDocument.location.origin) {
      event.preventDefault();
      if (url.hash && url.pathname === this.page()?.path) this.scrollToHeading(decodeURIComponent(url.hash.slice(1)));
      this.router.navigateByUrl(`${url.pathname}${url.search}${url.hash}`);
    }
  }
}
