import { FieldType as CoreFieldType } from '@ngx-formly/core';

export abstract class FieldType extends CoreFieldType {
  change(evt) {
    if (this.to.change) {
      this.to.change(this.field, evt);
    }
  }
}
