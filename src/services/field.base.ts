export class FieldBase<T>{
  key:string;
  controlType:string;
  templateOptions;
  validation;
  template: string;
  fieldGroup: Array<FieldBase<any>>;

  constructor(options:{
      key?:string,
      controlType?:string,
      templateOptions?:Object,
      validation?:any
    } = {}){
    this.key = options.key || '';
    this.controlType = options.controlType || '';
    this.templateOptions = options.templateOptions || '';
    this.validation = undefined;
    this.template = undefined;
  }
}