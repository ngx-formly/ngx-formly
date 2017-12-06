import { Component, Input } from '@angular/core';
import { CopierService } from '../copier/copier.service';

@Component({
  selector: 'formly-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
})
export class ExampleViewerComponent {
  @Input() title;
  @Input() example: { file: string; content: string }[];

  /** Whether the source for the example is being displayed. */
  showSource = false;

  constructor(private copier: CopierService) {}

  toggleSourceView() {
    this.showSource = !this.showSource;
  }

  copySource(content) {
    this.copier.copyText(content.innerText);
  }
}
