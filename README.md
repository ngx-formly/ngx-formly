[![Stories in Ready](https://badge.waffle.io/formly-js/ng2-formly.png?label=ready&title=Ready)](https://waffle.io/formly-js/ng2-formly)
<img src="https://raw.githubusercontent.com/formly-js/angular-formly/master/other/logo/angular-formly-logo-64px.png" alt="angular-formly logo" title="angular-formly" align="right" width="64" height="64" />


# ng2-formly

Status:
[![Build Status](https://travis-ci.org/formly-js/ng2-formly.svg?branch=master)](https://travis-ci.org/formly-js/ng2-formly)
[![npm version](https://badge.fury.io/js/ng2-formly.svg)](https://badge.fury.io/js/ng2-formly)

Links:
[![Gitter](https://badges.gitter.im/formly-js/angular2-formly.svg)](https://gitter.im/formly-js/angular2-formly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)


angular2-formly is an Angular 2 module which has a Components to help customize and render JavaScript/JSON configured forms.
The `formly-form` Component and the `FormlyConfig` service are very powerful and bring unmatched maintainability to your
application's forms.

Include the FormlyForm component import in the `directives` attribute of your `Component` and put this in your template
```html
<form class="formly" role="form" novalidate [formGroup]="form" (ngSubmit)="submit(user)">
    <formly-form [model]="user" [fields]="userFields">
        <button type="submit" class="btn btn-default">Button</button>
    </formly-form>
</form>
```

and in your TypeScript file define the the `model` and `fields` attributes
```ts
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
}];

this.user = {
  email: 'email@gmail.com',
  checked: false
};

```

## Quick Start
- install `ng2-formly`

```bash
  npm install ng2-formly --save
```
- add the script to the HTML file (if necessary)
```html
<!-- index.html -->
<script src="node_modules/ng2-formly/bundles/ng2-formly.min.js"></script>

```

- and to your component add

```ts
import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform/browser';
import {FormlyForm, FormlyConfig, FormlyMessages, TemplateDirectives, FormlyProviders} from 'ng2-formly'

@Component({
    selector: 'hello-app',
    template: `
        <h1>Hello, {{name}}!</h1>
        Say hello to: <input [value]="name" (input)="name = $event.target.value">
        <formly-form [model]="user" [fields]="userFields"></formly-form>
    `,
    directives: [FormlyForm],
    providers: [FormlyConfig, FormlyMessages]
})
export class HelloApp {
    name: string = 'World';
    user = {};
    userFields;
    constructor(fc: FormlyConfig) {
        ['input', 'checkbox'].forEach((field) => {
            fc.setType({
                name: field,
                component: TemplateDirectives[field]
            })
        });

        this.userFields = [{
            key: 'nameOfPerson',
            type: 'input',
            templateOptions: {}
        }]
    }
}

bootstrap(HelloApp, [FormlyProviders]);
```
From there, it's just JavaScript. Allowing for DRY, maintainable, reusable forms.

## Roadmap

See the [issues labeled enhancement](https://github.com/formly-js/angular2-formly/labels/enhancement)

## Supported templates

 - [Material2](https://github.com/formly-js/ng2-formly-template-material)
 - [Bootstrap](https://github.com/formly-js/ng2-formly-templates-bootstrap)


## Thanks

A special thanks to [Kent C. Dodds](https://twitter.com/kentcdodds) for giving me opportunity to work on this.
This library is maintained (with love) by me, [Mohammed Zama Khan](https://twitter.com/mohamedzamakhan).
Thanks to all [contributors](https://github.com/formly-js/angular2-formly/graphs/contributors)!
If you're trying to find angular-formly, go [here](https://github.com/formly-js/angular-formly)
