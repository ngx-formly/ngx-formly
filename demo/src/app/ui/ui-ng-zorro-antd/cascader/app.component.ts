import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

const fields: FormlyFieldConfig[] = [
  {
    key: 'Cascader',
    type: 'cascader',
    templateOptions: {
      label: 'cascader',
      nzPlaceHolder: 'Placeholder',
      description: 'Description',
      required: true,
      nzOptions: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                  isLeaf: true,
                },
              ],
            },
            {
              value: 'ningbo',
              label: 'Ningbo',
              isLeaf: true,
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = fields;
}
