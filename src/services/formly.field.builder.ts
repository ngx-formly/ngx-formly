

import {ComponentFactory, ComponentResolver, Injectable, ComponentRef} from "@angular/core";
import {FormlyFieldConfig} from "../components/formly.field.config";
import {FormlyConfig} from "./formly.config";
import {FormlyField} from "../components/formly.field";

@Injectable()
export class FormlyFieldBuilder {

  fc: FormlyConfig;

  constructor(protected cr: ComponentResolver) { }

  createChildFields(fieldConfig: FormlyFieldConfig, formlyField: FormlyField, formlyConfig: FormlyConfig): Promise<ComponentRef<any>> {
    // TODO support formlyField.field.hideExpression as a callback/observable
    formlyField.hide = fieldConfig.hideExpression ? true : false;

    return this.cr.resolveComponent(formlyConfig.getDirective(fieldConfig.type))
      .then((cf: ComponentFactory<any>) => {
        let ref = formlyField.myChild.viewContainer.createComponent(cf);
        ref.instance.viewModel = formlyField.viewModel;
        ref.instance.type = fieldConfig.type;
        ref.instance.templateOptions = fieldConfig.templateOptions;
        ref.instance.key = formlyField.key;
        ref.instance.form = formlyField.form;
        ref.instance.update = formlyField.update;
        ref.instance.field = fieldConfig;
        ref.instance.formModel = formlyField.formModel;
        formlyField.form.addControl(formlyField.key, ref.instance.formControl);
        return ref;
      });
  }
}
