import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { DataService } from './data.service';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'sport',
      type: 'select',
      templateOptions: {
        label: 'Sport',
        options: this.dataService.getSports(),
        valueProp: 'id',
        labelProp: 'name',
      },
    },
  ];

  constructor(private dataService: DataService) {}

  submit() {
    alert(JSON.stringify(this.model));
  }
}
