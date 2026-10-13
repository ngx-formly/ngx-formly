import gettingStartedMd from '../../../../docs/getting-started.md?raw' with { loader: 'text' };
import propertiesOptionsMd from '../../../../docs/properties-options.md?raw' with { loader: 'text' };
import customFormlyFieldMd from '../../../../docs/custom-formly-field.md?raw' with { loader: 'text' };
import customFormlyExtensionMd from '../../../../docs/custom-formly-extension.md?raw' with { loader: 'text' };
import customFormlyWrapperMd from '../../../../docs/custom-formly-wrapper.md?raw' with { loader: 'text' };
import validationMd from '../../../../docs/validation.md?raw' with { loader: 'text' };
import expressionPropertiesMd from '../../../../docs/expression-properties.md?raw' with { loader: 'text' };
import formlyFieldPresetsMd from '../../../../docs/formly-field-presets.md?raw' with { loader: 'text' };
import jsonSchemaMd from '../../../../docs/json-schema.md?raw' with { loader: 'text' };
import faqMd from '../../../../docs/faq.md?raw' with { loader: 'text' };
import migrationMd from '../../../../UPGRADE-10.0.md?raw' with { loader: 'text' };
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
  contents: { [id: string]: string } = {
    'getting-started': gettingStartedMd,
    'properties-options': propertiesOptionsMd,
    'custom-formly-field': customFormlyFieldMd,
    'custom-formly-extension': customFormlyExtensionMd,
    'custom-formly-wrapper': customFormlyWrapperMd,
    validation: validationMd,
    'expression-properties': expressionPropertiesMd,
    'formly-field-presets': formlyFieldPresetsMd,
    'json-schema': jsonSchemaMd,
    faq: faqMd,
    migration: migrationMd,
  };

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(({ id }) => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', renderMarkdown(this.contents[id]));
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
