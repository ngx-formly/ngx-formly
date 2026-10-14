import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-panel',
  template: `
    <div class="card">
      <h3 class="card-header">{{ props.label }}</h3>
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class PanelWrapperComponent extends FieldWrapper {}
