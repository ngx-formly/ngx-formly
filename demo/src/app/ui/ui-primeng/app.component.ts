import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'formly-app-example',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet],
})
export class AppComponent {}
