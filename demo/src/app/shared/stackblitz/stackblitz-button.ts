import { Component, Input, NgModule } from '@angular/core';
import { StackblitzWriter } from './stackblitz-writer';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExampleType } from '../example-viewer/example-viewer.component';

@Component({
  selector: 'formly-stackblitz-button',
  templateUrl: './stackblitz-button.html',
  providers: [StackblitzWriter],
})
export class StackblitzButtonComponent {
  stackblitzForm;

  @Input() type: string;
  @Input()
  set example(exampleData: ExampleType) {
    this.stackblitzForm = this.stackblitzWriter.constructStackblitzForm(this.type, exampleData);
  }

  constructor(private stackblitzWriter: StackblitzWriter) {}

  openStackblitz(): void {
    // When the form is submitted, it must be in the document body. The standard of forms is not
    // to submit if it is detached from the document. See the following chromium commit for
    // more details:
    // https://chromium.googlesource.com/chromium/src/+/962c2a22ddc474255c776aefc7abeba00edc7470%5E!
    document.body.appendChild(this.stackblitzForm);
    this.stackblitzForm.submit();
    document.body.removeChild(this.stackblitzForm);
  }
}

@NgModule({
  imports: [MatTooltipModule, MatButtonModule, MatIconModule],
  exports: [StackblitzButtonComponent],
  declarations: [StackblitzButtonComponent],
  providers: [StackblitzWriter],
})
export class StackblitzButtonModule {}
