import { Directive, Optional, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldType as CoreFieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Directive()
export abstract class FieldType<F extends FormlyFieldConfig = FormlyFieldConfig> extends CoreFieldType<F> {
  @ViewChild('fieldTypeTemplate', { static: true }) set content(templateRef: TemplateRef<any>) {
    if (templateRef && this.hostContainerRef) {
      this.hostContainerRef.createEmbeddedView(templateRef);
    }
  }

  constructor(@Optional() private hostContainerRef?: ViewContainerRef) {
    super();
  }
}
