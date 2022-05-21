import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
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
    'getting-started': require('!!raw-loader!!highlight-loader!markdown-loader!./introduction.md'),
    'properties-options': require('!!raw-loader!!highlight-loader!markdown-loader!./properties-options.md'),
    'custom-formly-field': require('!!raw-loader!!highlight-loader!markdown-loader!./custom-formly-field.md'),
    'custom-formly-extension': require('!!raw-loader!!highlight-loader!markdown-loader!./custom-formly-extension.md'),
    'custom-formly-wrapper': require('!!raw-loader!!highlight-loader!markdown-loader!./custom-formly-wrapper.md'),
    validation: require('!!raw-loader!!highlight-loader!markdown-loader!./validation.md'),
    'expression-properties': require('!!raw-loader!!highlight-loader!markdown-loader!./expression-properties.md'),
    'formly-field-presets': require('!!raw-loader!!highlight-loader!markdown-loader!./formly-field-presets.md'),
  };

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private elementRef: ElementRef) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.contents[id].default);
    });
  }
}
