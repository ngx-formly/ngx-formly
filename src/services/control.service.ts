import {Injectable}   from 'angular2/core';
import {FormBuilder} from 'angular2/common';
import {FieldBase} from './field.base';

@Injectable()
export class ControlService {
  constructor(private _fb:FormBuilder){ }

  toControlGroup(fields:FieldBase<any>[], model, key, value ) {
    let group = {};

    fields.forEach(field => {
      if(!field.template && !field.fieldGroup) {
          group[field.key] =  [(field.type === 'checkbox')? (model[field.key]? 'on': undefined) : model[field.key] || '', field.key === key && value ? undefined : field.validation];
      } else if(field.fieldGroup) {
          field.fieldGroup.forEach(f => {
              group[f.key] =  [(f.type === 'checkbox')? (model[f.key]? 'on': undefined) : model[f.key] || '', f.key === key && value ? undefined : f.validation];

          })
      }
    });
    return this._fb.group(group);
  }
}