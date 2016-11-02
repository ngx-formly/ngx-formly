import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '../../core/core';

@Component({
  selector: 'formly-wrapper-addons',
  template: `
    <div class="input-group">
    <div class="input-group-addon"
         *ngIf="templateOptions.addonLeft"
         [ngStyle]="{cursor: templateOptions.addonLeft.onClick ? 'pointer' : 'inherit'}"
         (click)="click($event)">
        <i [ngClass]="templateOptions.addonLeft.class" *ngIf="templateOptions.addonLeft.class"></i>
        <span *ngIf="templateOptions.addonLeft.text">{{templateOptions.addonLeft.text}}</span>
    </div>
    <template #fieldComponent></template>
    <div class="input-group-addon"
         *ngIf="templateOptions.addonRight"
         [ngStyle]="{cursor: templateOptions.addonRight.onClick ? 'pointer' : 'inherit'}"
         (click)="click($event)">
        <i [ngClass]="templateOptions.addonRight.class" *ngIf="templateOptions.addonRight.class"></i>
        <span *ngIf="templateOptions.addonRight.text">{{templateOptions.addonRight.text}}</span>
    </div>
</div>
  `,
})
export class FormlyWrapperAddons extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  click($event) {
    if (this.templateOptions['addonLeft'].onClick) {
      this.templateOptions['addonLeft'].onClick(this.templateOptions, this, $event);
    }
  }
}
