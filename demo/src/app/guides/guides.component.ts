import { GUIDE_CONTENTS } from './guides.content';
import { renderMarkdown } from '../shared/highlight';
import { Component, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'formly-demo-examples',
  template: '',
  host: {
    '[class]': '"markdown github"',
    '[style.display]': '"block"',
  },
  standalone: true,
})
export class GuidesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  contents = GUIDE_CONTENTS;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(({ id }) => {
      const path = `/guide/${this.route.snapshot.url.map((segment) => segment.path).join('/')}`;
      const content = renderMarkdown(this.contents[id])
        .replace(/href="docs\/([^"#]+)\.md/g, 'href="/guide/$1')
        .replace(/href="#/g, `href="${path}#`);
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', content);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
