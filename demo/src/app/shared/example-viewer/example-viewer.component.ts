import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnChanges,
} from '@angular/core';
import { CopierService } from '../copier/copier.service';
import JSONFormatter from 'json-formatter-js';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { getExampleFiles } from './utils';
import { NgIf, NgFor } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { StackblitzButtonComponent } from '../stackblitz/stackblitz-button';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

export interface ExampleType {
  title: string;
  description: string;
  component: any;
  deps?: string[];
  debug: boolean;
  files: { file: string; filecontent: { default: string }; content?: string }[];
}

@Component({
  selector: 'formly-example-viewer',
  templateUrl: './example-viewer.component.html',
  styleUrls: ['./example-viewer.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatIconButton,
    MatTooltip,
    MatIcon,
    FormlyForm,
    StackblitzButtonComponent,
    MatTabGroup,
    NgFor,
    MatTab,
  ],
})
export class ExampleViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: string;
  @Input() exampleData: ExampleType;
  @Input() set debugFields(fields: FormlyFieldConfig[]) {
    if (fields) {
      this._debugFields = JSON.parse(JSON.stringify(fields));
    }
  }

  exampleFiles: { file: string; content: string }[] = [];
  _debugFields: any;
  _prevModel: any;

  @ViewChild('demo', { read: ViewContainerRef, static: true }) demoRef!: ViewContainerRef;
  @ViewChild('modelPreview') modelPreviewRef!: ElementRef;
  demoComponentRef: ComponentRef<any>;

  /** Whether the source for the example is being displayed. */
  showSource = false;
  showDebug = false;

  constructor(
    private copier: CopierService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

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

  get debugModel() {
    return this.demoComponentRef.instance.fields[0];
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.exampleData.component);
    this.demoComponentRef = this.demoRef.createComponent(componentFactory);
  }

  ngOnChanges() {
    if (this.exampleData) {
      this.exampleFiles = getExampleFiles(this.type, this.exampleData).exampleFiles;
    }
  }

  ngOnDestroy() {
    if (this.demoComponentRef) {
      this.demoComponentRef.destroy();
    }
  }

  toggleSourceView() {
    this.showSource = !this.showSource;
  }

  copySource(content: HTMLElement) {
    this.copier.copyText(content.innerText);
  }

  toggleDebugView() {
    this.showDebug = !this.showDebug;
  }
}
