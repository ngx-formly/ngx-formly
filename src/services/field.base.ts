export class FieldBase<T>{
  key:string;
  controlType:string;
  templateOptions;
  validation;
  template: string;
  fieldGroup: Array<FieldBase<any>>;
  className: string;
    type: string;

  constructor(options:{
      key?:string,
      controlType?:string,
      templateOptions?:Object,
      validation?:any
    } = {}){
    this.templateOptions = options.templateOptions || {};
    this.key = options.key || '';
  }
}