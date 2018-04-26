import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

import { trigger, state, style, transition, animate, group } from '@angular/animations';

const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'max-height': '500px', 'opacity': '1', 'visibility': 'visible',
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden',
    })),
    transition('in => out', [group([
      animate('400ms ease-in-out', style({
        'opacity': '0',
      })),
      animate('600ms ease-in-out', style({
        'max-height': '0px',
      })),
      animate('700ms ease-in-out', style({
        'visibility': 'hidden',
      })),
    ],
    )]),
    transition('out => in', [group([
      animate('1ms ease-in-out', style({
        'visibility': 'visible',
      })),
      animate('600ms ease-in-out', style({
        'max-height': '500px',
      })),
      animate('800ms ease-in-out', style({
        'opacity': '1',
      })),
    ],
    )]),
  ]),
];

@Component({
  selector: 'formly-wrapper-animation',
  template: `
    <div [@slideInOut]="field.hide ? 'out' : 'in'">
      <ng-container #fieldComponent></ng-container>
    </div>
  `,
  animations: [SlideInOutAnimation],
})
export class AnimationWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}
