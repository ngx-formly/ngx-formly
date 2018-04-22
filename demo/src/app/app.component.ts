import { Component } from '@angular/core';

@Component({
  selector: 'formly-app',
  templateUrl: './app.component.html',
  styles: [`
    .app-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      height: 56px;
    }
  `],
})
export class AppComponent {}


