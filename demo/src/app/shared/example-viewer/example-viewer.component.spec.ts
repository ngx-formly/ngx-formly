import { Component } from '@angular/core';
import { createComponent } from '@ngx-formly/core/testing';
import { CopierService } from '../copier/copier.service';
import { ExampleViewerComponent } from './example-viewer.component';

@Component({
  template: `<button type="button" class="edit-model" (click)="model.name = 'Grace'">Edit model</button>`,
})
class PlainModelExampleComponent {
  model = { name: 'Ada' };
}

describe('Example model preview', () => {
  it('renders plain models initially and after an in-place edit', () => {
    const { query, detectChanges } = createComponent({
      template: '<formly-example-viewer [exampleData]="exampleData" />',
      inputs: { exampleData: { title: '', component: PlainModelExampleComponent, files: [] } },
      imports: [ExampleViewerComponent],
      providers: [CopierService],
    });
    const preview = () => query('.json-formatter-row').nativeElement.textContent;
    expect(preview()).toContain('Ada');

    query('.edit-model').nativeElement.click();
    detectChanges();
    expect(preview()).toContain('Grace');
  });
});
