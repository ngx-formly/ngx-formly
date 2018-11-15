import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {            
      type: 'tabBootstrap',
      fieldGroup: [],
      templateOptions: {
        steps: [
          {
            label: 'Personal data',
            fields: [
              {
                key: 'firstname',
                type: 'input',
                templateOptions: {
                  label: 'First name',
                  required: true,
                },
              },
              {
                key: 'age',
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Age',
                  required: true,
                },
              },
            ],
          },
          {
            label: 'Destination',
            fields: [
              {
                key: 'country',
                type: 'input',
                templateOptions: {
                  label: 'Country',
                  required: true,
                },
              },
            ],
          },
          {
            label: 'Day of the trip',
            fields: [
              {
                key: 'day',
                type: 'input',
                templateOptions: {
                  type: 'date',
                  label: 'Day of the trip',
                  required: true,
                },
              },
            ],
          },
        ]
      }


    }
  ]

constructor(){  

  //I would like to do this login in the template. 
  this.fields[0].fieldGroup = ([]).concat(this.fields[0].templateOptions.steps.map((val)=>{ 
    return {fieldGroup: val.fields} }));  
}


}


