import { Component } from '@angular/core';
import { FormlyFieldConfig, FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';
import { FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';

interface AddonsProps extends FormlyFieldProps {
  addonRight?: {
    onClick?: (field: FormlyFieldConfig, event?: any) => void;
    class?: string;
    text?: string;
  };
  addonLeft?: {
    onClick?: (field: FormlyFieldConfig, event?: any) => void;
    class?: string;
    text?: string;
  };
}

@Component({
  selector: 'formly-wrapper-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss'],
})
export class FormlyWrapperAddons extends FieldWrapper<FieldTypeConfig<AddonsProps>> {
  addonRightClick($event: any) {
    this.props.addonRight.onClick?.(this.field, $event);
  }

  addonLeftClick($event: any) {
    this.props.addonLeft.onClick?.(this.field, $event);
  }
}
