import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild('hintStart', { static: true }) hintStart!: TemplateRef<any>;
  @ViewChild('hintEnd', { static: true }) hintEnd!: TemplateRef<any>;

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'Input',
      type: 'input',
      props: {
        label: 'Input with string hints',
        placeholder: 'Placeholder',
        hintStart: 'hintStart accepts strings and TemplateRefs and is aligned to start',
        hintEnd: 'hintEnd accepts strings and TemplateRefs and is aligned to end',
        required: true,
      },
    },
    {
      key: 'Input2',
      type: 'input',
      props: {
        label: 'Input with template hints',
        required: true,
      },
      hooks: {
        afterViewInit: (field) => {
          field.props.hintStart = this.hintStart;
          field.props.hintEnd = this.hintEnd;
        },
      },
    },
    {
      key: 'Input3',
      type: 'input',
      props: {
        label: 'Input with description',
        description: 'Description field accepts strings and gets aligned to start',
        required: true,
      },
    },
  ];
}
