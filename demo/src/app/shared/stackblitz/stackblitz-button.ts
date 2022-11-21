import { Component, Input, NgModule } from '@angular/core';
import { StackblitzWriter } from './stackblitz-writer';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ExampleType } from '../example-viewer/example-viewer.component';

@Component({
  selector: 'formly-stackblitz-button',
  templateUrl: './stackblitz-button.html',
  providers: [StackblitzWriter],
})
export class StackblitzButtonComponent {
  @Input() type: string;
  @Input() example: ExampleType;

  constructor(private stackblitzWriter: StackblitzWriter) {}

  openStackblitz(): void {
    this.stackblitzWriter.open(this.type, this.example);
  }
}

@NgModule({
  imports: [MatTooltipModule, MatButtonModule, MatIconModule],
  exports: [StackblitzButtonComponent],
  declarations: [StackblitzButtonComponent],
  providers: [StackblitzWriter],
})
export class StackblitzButtonModule {}
