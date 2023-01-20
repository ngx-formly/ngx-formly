import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-addons',
  template: `
    <ng-template #matPrefix>
      <span
        *ngIf="props.addonLeft"
        [ngStyle]="{ cursor: props.addonLeft.onClick ? 'pointer' : 'inherit' }"
        (click)="addonLeftClick($event)"
      >
        <mat-icon *ngIf="props.addonLeft.icon">{{ props.addonLeft.icon }}</mat-icon>
        <span *ngIf="props.addonLeft.text">{{ props.addonLeft.text }}</span>
      </span>
    </ng-template>

    <ng-container #fieldComponent></ng-container>

    <ng-template #matSuffix>
      <span
        *ngIf="props.addonRight"
        [ngStyle]="{ cursor: props.addonRight.onClick ? 'pointer' : 'inherit' }"
        (click)="addonRightClick($event)"
      >
        <mat-icon *ngIf="props.addonRight.icon">{{ props.addonRight.icon }}</mat-icon>
        <span *ngIf="props.addonRight.text">{{ props.addonRight.text }}</span>
      </span>
    </ng-template>
  `,
})
export class FormlyWrapperAddons extends FieldWrapper implements AfterViewInit {
  @ViewChild('matPrefix', { static: true }) matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix', { static: true }) matSuffix!: TemplateRef<any>;

  ngAfterViewInit() {
    if (this.matPrefix) {
      // Note: for text use `textPrefix` property (only in Angular Material >= 15)
      this.props.prefix = this.matPrefix;
    }

    if (this.matSuffix) {
      // Note: for text use `textSuffix` property (only in Angular Material >= 15)
      this.props.suffix = this.matSuffix;
    }
  }

  addonRightClick($event: any) {
    if (this.props.addonRight.onClick) {
      this.props.addonRight.onClick(this.to, this, $event);
    }
  }

  addonLeftClick($event: any) {
    if (this.props.addonLeft.onClick) {
      this.props.addonLeft.onClick(this.to, this, $event);
    }
  }
}
