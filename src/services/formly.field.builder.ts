import {ComponentFactoryResolver, Injectable, ComponentRef} from "@angular/core";
import {FormlyFieldConfig} from "../components/formly.field.config";
import {FormlyConfig} from "./formly.config";
import {FormlyField} from "../components/formly.field";
import {Field} from "../templates/field";

@Injectable()
export class FormlyFieldBuilder {
  constructor(protected componentFactoryResolver: ComponentFactoryResolver) { }

  createChildFields(fieldConfig: FormlyFieldConfig, formlyField: FormlyField, formlyConfig: FormlyConfig): ComponentRef<Field> {
    // TODO support formlyField.field.hideExpression as a callback/observable
    formlyField.hide = fieldConfig.hideExpression ? true : false;

    let type = formlyConfig.getType(fieldConfig.type);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(type.component);
    let ref = <ComponentRef<Field>>formlyField.fieldComponent.createComponent(componentFactory);
    Object.assign(ref.instance, {
        model: formlyField.model,
        templateOptions: fieldConfig.templateOptions,
        key: formlyField.field.key,
        form: formlyField.form,
        update: formlyField.update,
        field: fieldConfig,
        formModel: formlyField.formModel,
    });
    formlyField.form.addControl(formlyField.field.key, ref.instance.formControl);

    return ref;
  }
}
