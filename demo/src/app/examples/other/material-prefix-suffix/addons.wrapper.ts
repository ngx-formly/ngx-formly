import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'formly-wrapper-addons',
  template: `
    <ng-template #matPrefix>
      @if (props.addonLeft) {
        <span [ngStyle]="{ cursor: props.addonLeft.onClick ? 'pointer' : 'inherit' }" (click)="addonLeftClick($event)">
          @if (props.addonLeft.icon) {
            <mat-icon>{{ props.addonLeft.icon }}</mat-icon>
          }
          @if (props.addonLeft.text) {
            <span>{{ props.addonLeft.text }}</span>
          }
        </span>
      }
    </ng-template>

    <ng-container #fieldComponent></ng-container>

    <ng-template #matSuffix>
      @if (props.addonRight) {
        <span
          [ngStyle]="{ cursor: props.addonRight.onClick ? 'pointer' : 'inherit' }"
          (click)="addonRightClick($event)"
        >
          @if (props.addonRight.icon) {
            <mat-icon>{{ props.addonRight.icon }}</mat-icon>
          }
          @if (props.addonRight.text) {
            <span>{{ props.addonRight.text }}</span>
          }
        </span>
      }
    </ng-template>
  `,
  imports: [NgStyle, MatIcon],
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
