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
})
export class GuidesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  contents: { [id: string]: any } = {
    'getting-started': require('!!raw-loader!!highlight-loader!markdown-loader!docs/getting-started.md'),
    'properties-options': require('!!raw-loader!!highlight-loader!markdown-loader!docs/properties-options.md'),
    'custom-formly-field': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-field.md'),
    'custom-formly-extension': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-extension.md'),
    'custom-formly-wrapper': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-wrapper.md'),
    validation: require('!!raw-loader!!highlight-loader!markdown-loader!docs/validation.md'),
    'expression-properties': require('!!raw-loader!!highlight-loader!markdown-loader!docs/expression-properties.md'),
    'formly-field-presets': require('!!raw-loader!!highlight-loader!markdown-loader!docs/formly-field-presets.md'),
    migration: require('!!raw-loader!!highlight-loader!markdown-loader!UPGRADE-6.0.md'),
  };

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private elementRef: ElementRef) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(({ id }) => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.contents[id].default);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
