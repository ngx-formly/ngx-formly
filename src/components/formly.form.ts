import {Component, OnInit, Input} from "@angular/core";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyFieldConfig} from "./formly.field.config";
import {FormlyConfig} from "../services/formly.config";

@Component({
  selector: "formly-form",
  template: `
    <formly-field *ngFor="let field of fields"
      [hide]="field.hideExpression" [model]="field.key?model[field.key]:model"
      [form]="form" [field]="field" [formModel]="model"
      (modelChange)="changeModel($event)"
      [ngClass]="field.className">
    </formly-field>
    <ng-content></ng-content>
  `,
})
export class FormlyForm implements OnInit  {
  @Input() formModel: any;
  @Input() model: any;
  @Input() form: FormGroup;
  @Input() fields: FormlyFieldConfig[];

  constructor(
    private formlyConfig: FormlyConfig,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (!this.model) {
      this.model = {};
    }
    if (!this.formModel) {
      this.formModel = this.model;
    }
    if (!this.form) {
      this.form = this.formBuilder.group({});
    }

    this.registerFormControls(this.fields);
  }

  changeModel(event: FormlyValueChangeEvent) {
    if (event.field.modelOptions && event.field.modelOptions.debounce && event.field.modelOptions.debounce.default) {
      setTimeout(() => {
        this.model[event.field.key] = event.value;
      }, event.field.modelOptions.debounce.default);
    } else {
      this.model[event.field.key] = event.value;
    }
  }

  private registerFormControls(fields) {
    fields.map(field => {
      if (field.key && field.type) {
        let componenType: any = this.formlyConfig.getType(field.type).component;
        if (Array.isArray(field.validation)) {
          let validators = [];
          field.validation.map((validate) => {
            validators.push(this.formlyConfig.getValidator(validate).validation);
          });
          field.validation = Validators.compose(validators);
        }

        if (componenType.createControl) {
          this.form.addControl(field.key, componenType.createControl(this.model[field.key] || "", field));
        } else {
          this.form.addControl(field.key, new FormControl({ value: this.model[field.key] || "", disabled: field.templateOptions.disabled }, field.validation));
        }
      }

      if (field.fieldGroup) {
        this.registerFormControls(field.fieldGroup);
      }
    });
  }
}
