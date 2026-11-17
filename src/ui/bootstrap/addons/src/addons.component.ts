import { Component, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormlyFieldConfig, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface AddonsProps extends FormlyFieldProps {
  addonRight?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Public addon callbacks and templates retain consumer-defined event and context types.
    onClick?: (field: FormlyFieldConfig, event?: any) => void;
    class?: string;
    text?: string;
  };
  addonLeft?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Public addon callbacks and templates retain consumer-defined event and context types.
    onClick?: (field: FormlyFieldConfig, event?: any) => void;
    class?: string;
    text?: string;
  };
}

@Component({
  selector: 'formly-wrapper-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class FormlyWrapperAddons extends FieldWrapper<FieldTypeConfig<AddonsProps>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Public addon callbacks and templates retain consumer-defined event and context types.
  @ViewChild('fieldTypeTemplate', { static: true }) set content(templateRef: TemplateRef<any>) {
    if (templateRef && this.hostContainerRef) {
      this.hostContainerRef.createEmbeddedView(templateRef);
    }
  }

  constructor(private hostContainerRef?: ViewContainerRef) {
    super();
  }

  addonRightClick($event: unknown) {
    this.props.addonRight.onClick?.(this.field, $event);
  }

  addonLeftClick($event: unknown) {
    this.props.addonLeft.onClick?.(this.field, $event);
  }
}
