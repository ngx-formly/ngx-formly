import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-addons',
  template: `
    <div class="input-group">
      <div class="input-group-prepend"
        *ngIf="to.addonLeft"
        [ngStyle]="{cursor: to.addonLeft.onClick ? 'pointer' : 'inherit'}"
        (click)="addonLeftClick($event)">
        <i class="input-group-text" [ngClass]="to.addonLeft.class" *ngIf="to.addonLeft.class"></i>
        <span *ngIf="to.addonLeft.text" class="input-group-text">{{ to.addonLeft.text }}</span>
      </div>
      <ng-template #fieldComponent></ng-template>
      <div class="input-group-append"
        *ngIf="to.addonRight"
        [ngStyle]="{cursor: to.addonRight.onClick ? 'pointer' : 'inherit'}"
        (click)="addonRightClick($event)">
        <i class="input-group-text" [ngClass]="to.addonRight.class" *ngIf="to.addonRight.class"></i>
        <span *ngIf="to.addonRight.text" class="input-group-text">{{ to.addonRight.text }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .input-group>:not(:first-child)> .form-control {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    :host ::ng-deep .input-group>:not(:last-child)> .form-control {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  `],
})
export class FormlyWrapperAddons extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent!: ViewContainerRef;

  addonRightClick($event: any) {
    if (this.to.addonRight.onClick) {
      this.to.addonRight.onClick(this.to, this, $event);
    }
  }

  addonLeftClick($event: any) {
    if (this.to.addonLeft.onClick) {
      this.to.addonLeft.onClick(this.to, this, $event);
    }
  }
}
