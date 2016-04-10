/// <reference path="./../typings/ng2-formly.d.ts" />
import {Component} from 'angular2/core';
import {Validators} from 'angular2/common';
import {bootstrap} from 'angular2/platform/browser';
import {FormlyForm} from './components/formly.form';
import {ValidationService} from './validation.service';
import {FormlyProviders} from './services/formly.providers'
import {FormlyMessages} from './services/formly.messages';
import { FormlyEventEmitter } from './services/formly.event.emitter';
import {FormlyConfig} from "./services/formly.config";
import {TemplateDirectives} from "./templates/templates";
import {FormlyBootstrap} from "./templates/formlyBootstrap";


/*************************************************************
    Interface for FormlyFields and FormlyTemplateOptions
 *************************************************************/

    interface IFormlyTemplateOptions {
        type?: string;
        label?: string;
        placeholder?: string;
        disabled?: Boolean,
        options?: Array<any>
    }
    interface IFormlyFields {
        key?: string;
        className?: string;
        fieldGroup?: Array<IFormlyFields>;
        type?: string;
        templateOptions?: IFormlyTemplateOptions;
        validation?: Validators;
        template?: string;
        expressionProperties?:Object;
        hideExpression?: boolean;
    }

@Component({
    directives: [FormlyForm],
    selector: 'hello-app',
    templateUrl: 'src/template.html',
    providers: [FormlyConfig]
})
export class HelloApp {
    
    Stream;
    constructor(fm: FormlyMessages, fc: FormlyConfig) {

        fm.addStringMessage('required', 'This field is required.');
        fm.addStringMessage('invalidEmailAddress', 'Invalid Email Address');
        fm.addStringMessage('maxlength', 'Maximum Length Exceeded.');
        fm.addStringMessage('minlength', 'Should have atleast 2 Characters');

        ['input', 'checkbox', 'radio', 'select'].forEach(function (field) {
            fc.setType({
                name: field,
                component: TemplateDirectives[field]
            });
        });
        this.Stream = new FormlyEventEmitter();
        
        setTimeout(() => {
            
            this.userFields = [{
                className: 'row',
                fieldGroup: [{
                    className: 'col-xs-4',
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Email address',
                        placeholder: 'Enter email',
                        disabled: true
                    },
                    validation: Validators.compose([Validators.required, ValidationService.emailValidator]),
                    expressionProperties: {
                        'templateOptions.disbled': '!model.password'
                    }
                }, {
                    className: 'col-xs-4',
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'Password'
                    },
                    validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)])
                }, {
                    className: 'col-xs-4',
                    key: 'select',
                    type: 'select',
                    templateOptions: {
                        options: [{
                            label: 'Male',
                            value: 'male'
                        }, {
                            label: 'Female',
                            value: 'female'
                        }],
                        label: 'Gender',
                        placeholder: 'Select Gender'
                    }
                }]
            }, {
                className: 'section-label',
                template: '</hr /><div><strong>Address:</strong></div>'
            }, {
                className: 'row',
                fieldGroup: [{
                    className: 'col-xs-6',
                    type: 'input',
                    key: 'street',
                    templateOptions: {
                        label: 'Street',
                        placeholder: '604 Causley Ave. '
                    }
                }, {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'city',
                    templateOptions: {
                        label: 'City',
                        placeholder: 'Arlington'
                    }
                }, {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'zip',
                    templateOptions: {
                        type: 'number',
                        label: 'Zip',
                        placeholder: '76010'
                    }
                }]
            }, {
                key: 'checked',
                type: 'checkbox',
                templateOptions: {
                    label: 'Check me out'
                }
            }];
            
            this.user = {
                email: 'email@gmail.com',
                checked: true,
                select: 'male'
            };
            this.Stream.emit({
                model: this.user,
                fields: this.userFields
            });
        }, 0);
    }
    user:any = {};
    userFields: Array<IFormlyFields> = [];

  console(data) {
      console.log(data);
  }
  
  showEmail() {
      this.user.email = "mohammedzamakhan";
      this.user.checked = !this.user.checked;
      this.Stream.emit({
          model: this.user
      });
  }
hide() {
    this.userFields[0].fieldGroup[0].hideExpression = !this.userFields[0].fieldGroup[0].hideExpression;
}
 
  changeEmail() {
      this.Stream.emit({});
  }  
  submit(user) {
      console.log(user);
  }
}

bootstrap(HelloApp, [FormlyBootstrap, FormlyProviders]);