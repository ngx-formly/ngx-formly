import {Injectable}   from 'angular2/core';
import {FormBuilder} from 'angular2/common';
import {FieldBase} from './field.base';

@Injectable()
export class ControlService {
  constructor(private _fb:FormBuilder){ }

  toControlGroup(fields:FieldBase<any>[], model ) {
    let group = {};

    fields.forEach(field => {
      if(!field.template && !field.fieldGroup) {
          group[field.key] =  [model[field.key] || '', field.validation];
      } else if(field.fieldGroup) {
          field.fieldGroup.forEach(f => {
              group[f.key] =  [model[f.key] || '', f.validation];
          })
      }
    });
    return this._fb.group(group);
  }
}