import {Component} from 'angular2/core';
import {ControlGroup, Validators} from 'angular2/common';
import {bootstrap} from 'angular2/platform/browser';
import {FormlyForm} from './components/formly.form';
import {ValidationService} from './validation.service';
import {FormlyProviders} from './services/formly.providers'
import {FormlyMessages} from './services/formly.messages';
import { FormlyEventEmitter } from './services/formly.event.emitter';

@Component({
    directives: [FormlyForm],
    selector: 'hello-app',
    templateUrl: 'src/template.html'
})
export class HelloApp {
    
    Stream;
    constructor(fm:FormlyMessages) {
        fm.addStringMessage('required', 'This field is required.');
        fm.addStringMessage('invalidEmailAddress', 'Invalid Email Address');
        fm.addStringMessage('maxlength', 'Maximum Length Exceeded.');
        fm.addStringMessage('minlength', 'Should have atleast 2 Characters');
        
        this.Stream = new FormlyEventEmitter();
        
        setTimeout(() => {
            
            this.userFields = [{
                className: 'row',
                fieldGroup: [{
                    className: 'col-xs-6',
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Email address',
                        placeholder: 'Enter email'
                    },
                    validation: Validators.compose([Validators.required, ValidationService.emailValidator])
                }, {
                    className: 'col-xs-6',
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'Password',
                        pattern: ''
                    },
                    validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)])
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
                        label: 'Street'
                    }
                }, {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'city',
                    templateOptions: {
                        label: 'City'
                    }
                }, {
                    className: 'col-xs-3',
                    type: 'input',
                    key: 'zip',
                    templateOptions: {
                        type: 'number',
                        label: 'Zip'
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
                checked: false
            };
            this.Stream.emit({
                model: this.user,
                fields: this.userFields
            });
        }, 0);
    }
    user = {};
    userFields: Array<Object> = [];
  
  console(data) {
      console.log(data);
  }
  
  showEmail() {
      this.user.email = "baigan";
      this.Stream.emit({});
  }
  
  submit(user) {
      console.log(user);
  }
}

bootstrap(HelloApp, [FormlyProviders]);