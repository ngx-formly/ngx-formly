import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {FieldWrapper} from "../field.wrapper";

@Component({
  selector: "formly-wrapper-validation-messages",
  template: `
    <template #fieldComponent></template>
    <div>
      <small class="text-muted text-danger" *ngIf="valid"><formly-message [form]="form" [controlName]="key"></formly-message></small>
    </div>
  `,
})
export class FormlyWrapperValidationMessages extends FieldWrapper {
  @ViewChild("fieldComponent", {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
