import { Component, Input, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ElementRef, AfterViewInit } from '@angular/core';
import { CopierService } from '../copier/copier.service';
import JSONFormatter from 'json-formatter-js';

@Component({
  selector: 'formly-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
})
export class ExampleViewerComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() description;
  @Input() component;
  @Input() debug;
  @Input() example: { file: string; content: string }[];

  _prevModel: any;

  @ViewChild('demo', {read: ViewContainerRef}) demoRef: ViewContainerRef;
  @ViewChild('modelPreview') modelPreviewRef: ElementRef;
  demoComponentRef: ComponentRef<any>;

  /** Whether the source for the example is being displayed. */
  showSource = false;

  constructor(private copier: CopierService, private componentFactoryResolver: ComponentFactoryResolver) {}

  get model() {
    const model = JSON.stringify(this.demoComponentRef.instance.model);
    if (this._prevModel !== model && this.modelPreviewRef && this.modelPreviewRef.nativeElement) {
      this._prevModel = model;
      const formatter = new JSONFormatter(this.demoComponentRef.instance.model, 5, { hoverPreviewEnabled: true });
      this.modelPreviewRef.nativeElement.innerHTML = '';
      this.modelPreviewRef.nativeElement.appendChild(formatter.render());
    }

    return this.demoComponentRef.instance.model;
  }

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
