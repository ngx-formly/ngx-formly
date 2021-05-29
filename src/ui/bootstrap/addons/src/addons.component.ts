import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyWrapperAddons extends FieldWrapper {
  addonRightClick($event: any) {
    this.to.addonRight.onClick?.(this.field, $event);
  }

  addonLeftClick($event: any) {
    this.to.addonLeft.onClick?.(this.field, $event);
  }
}
