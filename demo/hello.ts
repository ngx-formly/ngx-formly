// polyfills
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import { NgModule, Component, enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { FormlyModule, FormlyFieldConfig, FormlyBootstrapModule } from './../src/index';
import { ValidationService } from './validation.service';
import { RepeatComponent } from './repeatedSection';
import { FormlyFieldToggle } from './toggle';
import { FormlyWrapperHorizontalLabel } from './horizontal.wrapper';
import { FormlyPanelWrapper } from './panel.wrapper';

@Component({
  selector: 'formly-demo-hello-app',
  templateUrl: './template.html',
})
export class HelloApp {
  form: FormGroup;
  author;
  env;
  _user;
  user: any = {};
  options;
  private userFields: Array<FormlyFieldConfig> = [];

  constructor(fb: FormBuilder) {
    this.form = fb.group({});

    this.author = {
      name: 'Mohammed Zama Khan',
      url: 'https://www.github.com/mohammedzamakhan',
    };
    this.env = {
      angularVersion: '2.1.1',
      formlyVersion: '2.0.0-beta.13',
    };

    let userFields: Array<FormlyFieldConfig> = [{
        type: 'radio',
        key: 'title1',
        templateOptions: {
          options: [{
            key: 'mr',
            value: 'Mr.',
          }, {
            key: 'mrs',
            value: 'Mrs',
          }],
          label: 'Title 1',
          description: 'Select a title that suits your description',
        },
      }, {
        type: 'radio',
        key: 'title2',
        templateOptions: {
          options: [{
            key: 'mr',
            value: 'Mr.',
          }, {
            key: 'mrs',
            value: 'Mrs',
          }],
          label: 'Title 2',
          description: 'Select a title that suits your description',
        },
      }, {
        className: 'row',
        fieldGroup: [{
          className: 'col-md-6',
          key: 'email',
          type: 'input',
          templateOptions: {
            type: 'email',
            label: 'Email address',
            placeholder: 'Enter email',
            disabled: true,
          },
          lifecycle: {
            onInit: function() {
              this.to.label = 'Email Address *';
              this.to.label = this.to.label.toUpperCase();
            },
          },
          validators: {
            validation: Validators.compose([Validators.required, ValidationService.emailValidator]),
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.password',
          },
        }, {
          className: 'col-md-6',
          id: 'username',
          key: 'username',
          type: 'input',
          templateOptions: {
            label: 'Username',
            placeholder: 'Username',
            description: 'Existing username: john, tom, paul',
            required: true,
          },
          validation: {
            show: true,
          },
          expressionProperties: {
            'validation.show': 'model.checked === true ? true: null',
          },
          validators: {
            validation: Validators.maxLength(8),
            custom: (control: FormControl) => control.value !== 'tom',
          },
          asyncValidators: {
            validation: (control: FormControl) =>
            new Promise(resolve => resolve( control.value !== 'john' ? null : { uniqueUsername: true })),
            uniqueUserName: (control: FormControl) => new Promise(resolve => resolve( control.value !== 'paul')),
          },
        }, {
          className: 'col-md-6',
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            placeholder: 'Password',
            keyup: (field, formControl: FormControl) => {
              console.log(formControl.valid ? 'Valid' : 'Invalid');
            },
          },
          validators: {
            validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)]),
          },
        }, {
          className: 'col-md-6',
          key: 'confirmPassword',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Confirm Password',
            placeholder: 'Confirm Password',
            tabindex: 1,
          },
          validators: {
            validation: ValidationService.confirmPassword(this.form, 'password'),
          },
        }, {
          className: 'section-label',
          template: '<br/><hr/>',
        }, {
          className: 'col-md-4',
          key: 'select',
          type: 'select',
          templateOptions: {
            options: [{
              label: 'Male',
              value: 'male',
            }, {
              label: 'Female',
              value: 'female',
            }],
            label: 'Gender',
            placeholder: 'Select Gender',
          },
        }],
      }, {
        className: 'section-label',
        template: '<hr/><div><strong>Address:</strong></div>',
      }, {
        key: 'address',
        className: 'row',
        wrappers: ['panel'],
        templateOptions: {
          title: 'Address',
        },
        fieldGroup: [{
          className: 'col-md-6',
          type: 'input',
          key: 'street',
          validators: {
            validation: ['required'],
          },
          defaultValue: '204 Causley Ave. ',
          templateOptions: {
            label: 'Street',
            placeholder: '604 Causley Ave. ',
            description: 'Enter a valid US Address',
          },
        }, {
          className: 'col-md-3',
          type: 'input',
          key: 'city',
          templateOptions: {
            label: 'City',
            placeholder: 'Arlington',
          },
          validators: {
            city: {
              expression: (control: FormControl) => control.value && control.value.length > 3,
              message: `City: Should have atleast 3 Characters`,
            },
          },
        }, {
          className: 'col-md-3',
          type: 'input',
          key: 'zip',
          templateOptions: {
            type: 'number',
            label: 'Zip',
            placeholder: '76010',
            max: 99999,
            min: 11111,
            minLength: 5,
            maxLength: 5,
            pattern: '([0-9]{5})?',
            required: true,
            step: 500,
          },
          validators: {
            zipCode: (control: FormControl) => control.value && control.value.length === 5,
          },
        }],
      }, {
        key: 'checked',
        type: 'checkbox',
        templateOptions: {
          label: 'Check me out',
          description: 'If you want to check me out, check this box',
        },
      }, {
        type: 'multicheckbox',
        key: 'interest',
        className: 'col-md-6',
        templateOptions: {
          options: [{
            key: 'sports',
            value: 'Sports',
          }, {
            key: 'movies',
            value: 'Movies',
          }, {
            key: 'others',
            value: 'Others',
          }],
          label: 'Interest',
          description: 'Select areas which you are interested',
        },
      }, {
        type: 'multicheckbox',
        key: 'hobbies',
        className: 'col-md-6',
        templateOptions: {
          options: [{
            key: 'sports',
            value: 'Sports',
          }, {
            key: 'movies',
            value: 'Movies',
          }, {
            key: 'languages',
            value: 'Languages',
          }],
          label: 'Hobbies',
          description: 'Select areas which you are interested',
        },
      }, {
        key: 'otherInterest',
        type: 'horizontalInput',
        hideExpression: '!model.interest.others',
        templateOptions: {
          rows: 5,
          cols: 20,
          placeholder: 'Type a paragraph about your interest...',
          label: 'Other Interest',
        },
      }, {
        key: 'textAreaVal',
        type: 'textarea',
        modelOptions: {
          debounce: {
            default: 2000,
            blur: 0,
          },
          updateOn: 'default blur',
        },
        templateOptions: {
          rows: 5,
          cols: 20,
          label: 'Message (Type a paragraph...)',
          description: 'Please enter atleast 150 characters',
          focus: true,
        },
      }, {
        key: 'toggleVal',
        type: 'toggle',
        templateOptions: {
          isAlert: true,
          isLarge: false,
        },
      }, {
        className: 'section-label',
        template: '<hr/><div><strong>Nested property keys:</strong></div>',
      }, {
        key: 'nested.property.magic',
        type: 'input',
        templateOptions: {
          label: 'Nested property',
          title: 'Nested Property',
          templateManipulators: {
            preWrapper: [() => 'panel'],
          },
        },
      }, {
        key: 'nested.arrays.0',
        type: 'input',
        templateOptions: {
          label: 'Array property',
        },
        defaultValue: 'Default Value',
        parsers: [(value) => (value || '').toUpperCase()],
      }, {
        type: 'repeatSection',
        key: 'investments',
        fieldArray: {
          className: 'row',
          templateOptions: {
            btnText: 'Add another investment',
          },
          fieldGroup: [
            {
              className: 'col-md-4',
              type: 'input',
              key: 'investmentName',
              templateOptions: {
                label: 'Name of Investment:',
                required: true,
              },
            },
            {
              type: 'input',
              key: 'investmentDate',
              className: 'col-xs-4',
              optionsTypes: ['dateFormat'],
              templateOptions: {
                label: 'Date of Investment:',
              },
            },
            {
              type: 'input',
              key: 'stockIdentifier',
              className: 'col-md-4',
              templateOptions: {
                label: 'Stock Identifier:',
                addonRight: {
                  class: 'fa fa-code',
                },
              },
            },
          ],
        },
      },
    ];

    setTimeout(() => this.userFields = userFields);
    this.user = {
      email: 'email@gmail.com',
      checked: true,
      select: 'male',
      title1: 'mr',
      title2: 'mrs',
      toggleVal: true,
      address: {
        street: '604 Causley Eve',
      },
      interest: {
        movies: false,
        sports: false,
        others: true,
      },
      hobbies: {
        movies: true,
        sports: false,
        languages: true,
      },
      nested: {
        property: {
          magic: 'Nested property Content',
        },
      },
      investments: [
        {
          investmentName: 'Formly',
          investmentDate: '02-11-2001',
          stockIdentifier: 'FO',
        }, {
          investmentName: 'Formly Website',
          investmentDate: '02-11-2001',
          stockIdentifier: 'FW',
        },
      ],
    };

    this.options = {
      formState: {
        readOnly: true,
      },
    };

  }

  console(data) {
    console.log(data);
  }

  showEmail() {
    this.form.get('email').setValue('mohammedzamakhan');
    this.form.get('checked').setValue(!this.user.checked);
  }

  hide() {
    this.userFields[1].fieldGroup[0].hideExpression = !this.userFields[1].fieldGroup[0].hideExpression;
  }

  changeEmail(value) {
    this.user = Object.assign({}, this.user, { email: value });
  }

  toggleReadOnly(value) {
    this.options.formState.readOnly = value;
  }

  resetForm() {
    this.form.reset({
      email: 'email@gmail.com',
      checked: true,
      select: 'male',
      title1: 'mr',
      title2: 'mrs',
      toggleVal: true,
      interest: {
        movies: false,
        sports: false,
        others: true,
      },
    });
  }

  submit(user) {
    console.log(user);
  }
}

@NgModule({
  declarations: [
    HelloApp, FormlyFieldToggle, FormlyWrapperHorizontalLabel, RepeatComponent, FormlyPanelWrapper,
  ],
  imports: [
    BrowserModule,
    FormlyModule.forRoot({
      types: [
        { name: 'toggle', component: FormlyFieldToggle, defaultOptions: { templateOptions: { isAlert: false, isLarge: true }}},
        { name: 'horizontalInput', extends: 'input'},
        { name: 'repeatSection', component: RepeatComponent },
        { name: 'dateFormat', defaultOptions: { templateOptions: {
          placeholder: 'dd/mm/yyyy such as 20/05/2015',
          dateFormat: 'DD, d  MM, yy',
          addonLeft: {
            class: 'fa fa-usd',
          },
        },
        validators: {
          date: control => control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) },
        },
      }],
      validators: [{ name: 'required', validation: Validators.required}],
      validationMessages: [
        { name: 'required', message: (err, field) => `${field.templateOptions.label} is required.`},
        { name: 'invalidEmailAddress', message: 'Invalid Email Address' },
        { name: 'maxlength', message: 'Maximum Length Exceeded.' },
        { name: 'minlength', message: (err) => {
            return `Should have atleast ${err.requiredLength} Characters`;
          },
        },
        { name: 'not_matching', message: 'Password Not Matching' },
        { name: 'zipCode', message: 'ZIP code should be 5 characters'},
        { name: 'uniqueUsername', message: 'This username is already taken.'},
      ],
      wrappers: [
        { name: 'formly-wrapper-horizontal', component: FormlyWrapperHorizontalLabel, types: ['horizontalInput'] },
        { name: 'panel', component: FormlyPanelWrapper },
      ],
    }),
    FormlyBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [HelloApp],
})
export class FormlyDemoModule {
}
enableProdMode();
platformBrowserDynamic().bootstrapModule(FormlyDemoModule);
