import { Component, Input, NgModule } from '@angular/core';
import { StackblitzWriter } from './stackblitz-writer';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatTooltipModule, MatTooltip } from '@angular/material/tooltip';
import { ExampleType } from '../example-viewer/example-viewer.component';

@Component({
  selector: 'formly-stackblitz-button',
  templateUrl: './stackblitz-button.html',
  providers: [StackblitzWriter],
  standalone: true,
  imports: [MatIconButton, MatTooltip, MatIcon],
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
  imports: [MatTooltipModule, MatButtonModule, MatIconModule, StackblitzButtonComponent],
  exports: [StackblitzButtonComponent],
  providers: [StackblitzWriter],
})
export class StackblitzButtonModule {}
