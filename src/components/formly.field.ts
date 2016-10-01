import {
  Component, OnInit, EventEmitter, ElementRef, Output,
  ViewContainerRef, ViewChild, ComponentRef, Renderer,
  ComponentFactoryResolver
} from "@angular/core";
import {FormlyCommon} from "./formly.common.component";
import {FormlyPubSub, FormlyEventEmitter, FormlyValueChangeEvent} from "../services/formly.event.emitter";
import {FormlyConfig} from "../services/formly.config";
import {Field} from "../templates/field";

@Component({
  selector: "formly-field",
  template: `
    <template #fieldComponent></template>
    <div *ngIf="field.template && !field.fieldGroup" [innerHtml]="field.template"></div>

    <formly-field *ngFor="let f of field.fieldGroup"
      [hide]="f.hideExpression"
      [model]="model?(f.key ? model[f.key]: model):''"
      [form]="form" [field]="f" [formModel]="formModel"
      (modelChange)="changeModel($event)"
      [ngClass]="f.className">
    </formly-field>
  `,
  inputs: ["field", "formModel", "form", "hide", "model", "key"],
})
export class FormlyField extends FormlyCommon implements OnInit {
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  @ViewChild("fieldComponent", {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
  private fieldComponentRef: ComponentRef<Field>;

  constructor(
    elementRef: ElementRef,
    formlyPubSub: FormlyPubSub,
    renderer: Renderer,
    private formlyConfig: FormlyConfig,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(elementRef, formlyPubSub, renderer);
  }

  ngOnInit() {
    this.createChildFields();
  }

  changeModel(event: FormlyValueChangeEvent) {
    if (this.field.key && this.field.key !== event.key) {
      if (!this.model) {
        this.model = {};
      }

      this.model[event.key] = event.value;
      event = new FormlyValueChangeEvent(this.field.key, this.model);
    }

    this.modelChange.emit(event);
  }

  private createChildFields() {
    if (this.field && !this.field.template && !this.field.fieldGroup) {
      this.fieldComponentRef = this.createFieldComponent();
      this.fieldComponentRef.instance.formControl.valueChanges.subscribe((event) => {
        this.changeModel(new FormlyValueChangeEvent(this.field.key, event));
      });

      let update = new FormlyEventEmitter();
      update.subscribe((option: any) => {
        this.field.templateOptions[option.key] = option.value;
      });

      this.formlyPubSub.setEmitter(this.field.key, update);
    }
  }

  private createFieldComponent(): ComponentRef<Field> {
    // TODO support this.field.hideExpression as a callback/observable
    this.hide = this.field.hideExpression ? true : false;

    let type = this.formlyConfig.getType(this.field.type);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(type.component);
    let ref = <ComponentRef<Field>>this.fieldComponent.createComponent(componentFactory);
    Object.assign(ref.instance, {
        model: this.model,
        templateOptions: this.field.templateOptions,
        key: this.field.key,
        form: this.form,
        field: this.field,
        formModel: this.formModel,
        formControl: this.form.get(this.field.key),
    });

    return ref;
  }
}
