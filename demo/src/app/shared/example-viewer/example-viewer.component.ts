import { Component, Input, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { CopierService } from '../copier/copier.service';

@Component({
  selector: 'formly-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
})
export class ExampleViewerComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() description;
  @Input() component;
  @Input() example: { file: string; content: string }[];

  @ViewChild('demo', {read: ViewContainerRef}) demoRef: ViewContainerRef;
  demoComponentRef: ComponentRef<any>;

  /** Whether the source for the example is being displayed. */
  showSource = false;

  constructor(private copier: CopierService, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.demoComponentRef = this.demoRef.createComponent(componentFactory);
  }

  ngOnDestroy() {
    if (this.demoComponentRef) {
      this.demoComponentRef.destroy();
    }
  }

  toggleSourceView() {
    this.showSource = !this.showSource;
  }

  copySource(content) {
    this.copier.copyText(content.innerText);
  }
}
