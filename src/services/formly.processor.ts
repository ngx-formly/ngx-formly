
import {FormlyFieldConfig} from "../components/formly.config";

export interface FormlyConfigVisitor {
  visit(config: FormlyFieldConfig);
}

export class FormlyConfigProcessor {

  visitors: FormlyConfigVisitor[] = [new FormlyConfigValidator()];

  process(fieldConfigs: FormlyFieldConfig[]): void {
    fieldConfigs.forEach(field => {
      this.visitors.forEach(visitor => {
        visitor.visit(field);
      });
    });
  }
}

class FormlyConfigValidator implements  FormlyConfigVisitor {
  visit (field: FormlyFieldConfig) {}
}
