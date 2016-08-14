/// <reference path="./../typings/ng2-formly.d.ts" />
import {Component, Renderer, ViewChildren, QueryList, ElementRef} from "@angular/core";
import {Validators, FormBuilder} from "@angular/forms";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {FormlyForm} from "./../src/components/formly.form";
import {ValidationService} from "./validation.service";
import {FormlyProviders} from "./../src/services/formly.providers";
import {FormlyMessages} from "./../src/services/formly.messages";
import {FormlyEventEmitter} from "./../src/services/formly.event.emitter";
import {FormlyConfig} from "./../src/services/formly.config";
import {TemplateDirectives} from "./../src/templates/templates";
import {FormlyBootstrap} from "./../src/templates/formlyBootstrap";
import {Field} from "./../src/templates/field";
import {FormlyPubSub} from "./../src/services/formly.event.emitter";
import {FormlyFieldConfig} from "./../src/components/formly.field.config";
import {SingleFocusDispatcher} from "../src/services/formly.single.focus.dispatcher";
import {disableDeprecatedForms, provideForms, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

// Custom Input Field type 'toggle' Component Definition
@Component({
  selector: "formly-field-toggle",
  template: `
    <div [formGroup]="form">
      <div class="checkbox-toggle">
          <input id="checkbox" type="checkbox" type="checkbox" [formControlName]="key" (change)="inputChange($event, 'checked')" value="on">
          <label for="checkbox">
              <div></div>
          </label>
      </div>
  </div>
  `,
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  inputs: [ "form", "update", "templateOptions", "key", "field", "formModel", "model"],
  queries: {inputComponent: new ViewChildren("inputElement")}
})
export class FormlyFieldToggle extends Field {

  constructor(fm: FormlyMessages, ps: FormlyPubSub, renderer: Renderer, focusDispatcher: SingleFocusDispatcher) {
    super(fm, ps, renderer, focusDispatcher);
  }

  inputComponent: QueryList<ElementRef>;

  protected setNativeFocusProperty(newFocusValue: boolean): void {
    if (this.inputComponent.length > 0) {
      this.renderer.invokeElementMethod(this.inputComponent.first.nativeElement, "focus", [newFocusValue]);
    }
  }
}

@Component({
  directives: [FormlyForm],
  selector: "hello-app",
  templateUrl: "../demo/template.html",
  providers: [FormlyConfig, FormlyMessages]
})
export class HelloApp {
  form;
  Stream;
  author;
  env;
  _user;
  constructor(fm: FormlyMessages, fc: FormlyConfig, protected fb: FormBuilder) {

    if (!this.form) {
      this.form = this.fb.group({});
    }

    fm.addStringMessage("required", "This field is required.");
    fm.addStringMessage("invalidEmailAddress", "Invalid Email Address");
    fm.addStringMessage("maxlength", "Maximum Length Exceeded.");
    fm.addStringMessage("minlength", "Should have atleast 2 Characters");

    ["input", "checkbox", "radio", "select", "textarea", "multicheckbox"].forEach(function (field) {
      fc.setType({
        name: field,
        component: TemplateDirectives[field]
      });
    });
    this.author = {
      name: "Mohammed Zama Khan",
      url: "https://www.github.com/mohammedzamakhan"
    };
    this.env = {
      angularVersion: "2.0.0-rc.1",
      formlyVersion: "2.0.0-beta.5"
    };
    fc.setType({
      name: "toggle",
      component: FormlyFieldToggle
    });

    this.Stream = new FormlyEventEmitter();

    setTimeout(() => {

      this.userFields = [{
        type: "radio",
        key: "title",
        templateOptions: {
          options: [{
            key: "mr",
            value: "Mr."
          }, {
            key: "mrs",
            value: "Mrs"
          }],
          label: "Title",
          description: "Select a title that suits your description"
        }
      }, {
        className: "row",
        fieldGroup: [{
          className: "col-xs-5",
          fieldGroup: [{
            className: "row",
            fieldGroup: [{
            className: "col-xs-4",
            key: "email",
            type: "input",
            templateOptions: {
              type: "email",
              label: "Email address",
              placeholder: "Enter email",
              disabled: true
            },
            validation: Validators.compose([Validators.required, ValidationService.emailValidator]),
            expressionProperties: {
              "templateOptions.disabled": "!model.password"
            }
          }, {
            className: "col-xs-4",
            key: "password",
            type: "input",
            templateOptions: {
              type: "password",
              label: "Password",
              placeholder: "Password"
            },
            validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)])
          }, {
            className: "col-xs-4",
            key: "select",
            type: "select",
            templateOptions: {
              options: [{
                label: "Male",
                value: "male"
              }, {
                label: "Female",
                value: "female"
              }],
              label: "Gender",
              placeholder: "Select Gender"
            }
          }]

          }]
        }, {
          className: "col-md-7",
          fieldGroup: [{
            className: "row",
            fieldGroup: [{
              className: "col-xs-6",
              type: "input",
              key: "street",
              templateOptions: {
                label: "Street",
                placeholder: "604 Causley Ave. ",
                description: "Enter a valid US Address"
              }
            }, {
              className: "col-xs-3",
              type: "input",
              key: "city",
              templateOptions: {
                label: "City",
                placeholder: "Arlington"
              }
            }, {
              className: "col-xs-3",
              type: "input",
              key: "zip",
              templateOptions: {
                type: "number",
                label: "Zip",
                placeholder: "76010"
              }
            }]
          }]
        }]
      }, {
        key: "checked",
        type: "checkbox",
        templateOptions: {
          label: "Check me out",
          description: "If you want to check me out, check this box"
        }
      }, {
        type: "multicheckbox",
        key: "interest",
        templateOptions: {
          options: [{
            key: "sports",
            value: "Sports"
          }, {
            key: "movies",
            value: "Movies"
          }, {
            key: "others",
            value: "Others"
          }],
          label: "Interest",
          description: "Select areas which you are interested"
        }
      }, {
        key: "otherInterest",
        type: "textarea",
        hideExpression: "!model.interest.others",
        templateOptions: {
          rows: 5,
          cols: 20,
          placeholder: "Type a paragraph about your interest...",
          label: "Other Interest"
        }
      }, {
        key: "textAreaVal",
        type: "textarea",
        templateOptions: {
          rows: 5,
          cols: 20,
          placeholder: "Type a paragraph...",
          label: "Message",
          description: "Please enter atleast 150 characters",
          focus: true
        }
      }, {
        key: "toggleVal",
        type: "toggle",
        templateOptions: {

        }
      }];

      this.user = {
        email: "email@gmail.com",
        checked: true,
        select: "male",
        title: "mr",
        toggleVal: true,
        interest: {
          "movies": false,
          "sports": false,
          "others": true
        }
      };
      this.Stream.emit({
        model: this.user,
        fields: this.userFields
      });
    }, 0);
  }
  user: any = {};
  private userFields: Array<FormlyFieldConfig> = [];

  console(data) {
    console.log(data);
  }

  showEmail() {
    this._user = Object.assign({}, this.user);
    this._user.email = "mohammedzamakhan";
    this._user.checked = !this.user.checked;
    this.user = this._user;
    this.Stream.emit({
      model: this.user
    });
  }
  hide() {
    this.userFields[1].fieldGroup[0].hideExpression = !this.userFields[1].fieldGroup[0].hideExpression;
  }

  changeEmail() {
    this.Stream.emit({});
  }

  resetForm() {
    this.user = {
      email: "email@gmail.com",
      checked: true,
      select: "male",
      title: "mr",
      toggleVal: true,
      interest: {
        "movies": false,
        "sports": false,
        "others": true
      }
    };
  }

  submit(user) {
    console.log(user);
  }
}

bootstrap(HelloApp, [disableDeprecatedForms(),
  provideForms(),
  FormlyBootstrap,
  FormlyProviders]);
