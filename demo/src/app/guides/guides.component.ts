import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Renderer2, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'formly-demo-examples',
  template: '',
  host: {
    '[class]': '"markdown github"',
    '[style.display]': '"block"',
  },
})
export class GuidesComponent implements OnInit {
  contents: { [id: string]: any } = {
    'getting-started': require('!!raw-loader!!highlight-loader!markdown-loader!docs/getting-started.md'),
    'properties-options': require('!!raw-loader!!highlight-loader!markdown-loader!docs/properties-options.md'),
    'custom-formly-field': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-field.md'),
    'custom-formly-extension': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-extension.md'),
    'custom-formly-wrapper': require('!!raw-loader!!highlight-loader!markdown-loader!docs/custom-formly-wrapper.md'),
    validation: require('!!raw-loader!!highlight-loader!markdown-loader!docs/validation.md'),
    'expression-properties': require('!!raw-loader!!highlight-loader!markdown-loader!docs/expression-properties.md'),
    'formly-field-presets': require('!!raw-loader!!highlight-loader!markdown-loader!docs/formly-field-presets.md'),
  };

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit() {
    console.log(window.location.origin);

    this.route.params.subscribe(({ id }) => {
      let content: string = this.contents[id].default;
      if (isPlatformBrowser(this.platformId) && window.location.origin === 'https://main.formly.dev') {
        content = content.replace('https://formly.dev', 'https://main.formly.dev');
      }
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', content);
    });
  }
}
