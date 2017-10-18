import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ValidationService, SuperHerosService } from './services';

@Component({
  selector: 'formly-demo-hello-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form: FormGroup;
  author;
  env;
  _user;
  user: any = {};
  options;
  userFields: Array<FormlyFieldConfig> = [];

  constructor(fb: FormBuilder, private sh: SuperHerosService) {
    this.form = fb.group({});

    this.author = {
      name: 'Mohammed Zama Khan',
      url: 'https://www.github.com/mohammedzamakhan',
    };
    this.env = {
      angularVersion: '2.1.1',
      formlyVersion: '1.0.0-rc.2',
    };

    let userFields: Array<FormlyFieldConfig> = [{
        type: 'radio',
        key: 'title1',
        formControl: new FormControl('mrs'),
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
        className: 'col-12',
        hide: true,
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
        fieldGroupClassName: 'row',
        className: 'col-12',
        fieldGroup: [{
          className: 'col-sm-6',
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
          className: 'col-sm-6',
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
            'templateOptions.disabled': '!formState.readOnly',
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
          className: 'col-sm-6',
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
          className: 'col-sm-6',
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
          className: 'col-sm-4',
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
        } , {
          className: 'col-sm-4',
          key: 'selectSuperHero',
          type: 'select',
          templateOptions: {
            options: [],
            label: 'Gender',
            labelProp: 'name',
            groupProp: 'gender',
            placeholder: 'Select Gender',
          },
          lifecycle: {
            onInit: (form, field) => {
              field.templateOptions.options = this.sh.get();
            },
          },
        }],
      },  {
        className: 'section-label',
        template: '<hr/><div><strong>Address:</strong></div>',
      }, {
        key: 'address',
        fieldGroupClassName: 'row',
        className: 'col-12',
        wrappers: ['panel'],
        templateOptions: {
          title: 'Address',
        },
        fieldGroup: [{
          className: 'col-sm-6',
          type: 'input',
          key: 'street',
          validators: {
            validation: ['required'],
          },
          validation: {
            messages: {
              required: 'WOW!! Enter the Street',
            },
          },
          defaultValue: '204 Causley Ave. ',
          templateOptions: {
            label: 'Street',
            placeholder: '604 Causley Ave. ',
            description: 'Enter a valid US Address',
          },
        }, {
          className: 'col-sm-3',
          type: 'input',
          key: 'city',
          templateOptions: {
            label: 'City',
            placeholder: 'Arlington',
          },
          validation: {
            messages: {
              city: 'City: atleast 3',
            },
          },
          validators: {
            city: {
              expression: (control: FormControl) => control.value && control.value.length > 3,
              message: `City: Should have atleast 3 Characters`,
            },
          },
        }, {
          className: 'col-sm-3',
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
        className: 'col-sm-6',
        templateOptions: {
          disabled: true,
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
        className: 'col-sm-6',
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
        focus: true,
        templateOptions: {
          rows: 5,
          cols: 20,
          label: 'Message (Type a paragraph...)',
          description: 'Please enter atleast 150 characters',
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
        key: 'nested.property.title',
        type: 'radio',
        templateOptions: {
          options: [{
            key: 'mr',
            value: 'Mr.',
          }, {
            key: 'mrs',
            value: 'Mrs',
          }, {
            key: 'miss',
            value: 'Miss',
          }],
          label: 'Nested Title',
          description: 'Select a title that suits your description',
        },
      },
      {
        key: 'nested.arrays.0.item',
        type: 'input',
        templateOptions: {
          label: 'Array with dots',
        },
        defaultValue: 'Default Value A',
        parsers: [(value) => (value || '').toUpperCase()],
      }, {
        key: 'nested.arrays[1].item',
        type: 'input',
        templateOptions: {
          label: 'Array property',
        },
        defaultValue: 'Default Value B',
        parsers: [(value) => (value || '').toUpperCase()],
      }, {
        type: 'repeatSection',
        key: 'investments',
        fieldArray: {
          fieldGroupClassName: 'row',
          templateOptions: {
            btnText: 'Add another investment',
          },
          fieldGroup: [
            {
              className: 'col-sm-4',
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
              className: 'col-sm-4',
              optionsTypes: ['dateFormat'],
              templateOptions: {
                label: 'Date of Investment:',
              },
              validators: {
                validation: Validators.compose([Validators.required]),
              },
            },
            {
              type: 'input',
              key: 'stockIdentifier',
              className: 'col-sm-4',
              templateOptions: {
                label: 'Stock Identifier:',
                addonRight: {
                  class: 'fa fa-code',
                  onClick: (to, fieldType, $event) => console.log(to, fieldType, $event),
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
      selectSuperHero: 'captain_america',
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
        submitted: false,
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

  resetModelWithModel() {
    this.options.resetModel({
      checked: true,
      title1: 'mrs',
      toggleVal: false,
      interest: {
        sports: true,
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
        }, {
          investmentName: 'Alphabet',
          investmentDate: '12-02-2016',
          stockIdentifier: 'GOOGL',
        },
      ],
      nested: {
        property: {
          magic: 'look what I can do',
        },
        arrays: {
          0: 'why not?',
        },
      },
      unbound: 'not bound in formly',
    });
  }

  submit(user) {
    this.options.formState.submitted = true;
    console.log(user);
  }
}


