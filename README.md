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

***This is still a serious WIP.***

Include the FormlyForm in the `directives` attribute of you `Component` and put this in your template
```html
<formly-form [model]="user" [fields]="userFields">
    <button type="submit" class="btn btn-default" (click)="submit(user)">Button</button>
</formly-form>
```

and in your TypeScript file define the the `model` and `fields` attrnbutes
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

From there, it's just JavaScript. Allowing for DRY, maintainable, reusable forms.

## Roadmap

See the [issues labeled enhancement](https://github.com/formly-js/angular2-formly/labels/enhancement)

## Financial Support

Some have expressed a desire to contribute financially as a way of expressing gratitude. I appreciate anything you (or
your company) would be willing to contribute :-) You can support me [here](https://www.patreon.com/mohammedzamakhan). Thanks!

## Thanks

A special thanks to [Kent C. Dodds](https://twitter.com/kentcdodds) for giving me opportunity to work on this.
This library is maintained (with love) by me, [Mohammed Zama Khan](https://twitter.com/mohamedzamakhan).
Thanks to all [contributors](https://github.com/formly-js/angular2-formly/graphs/contributors)!
If you're trying to find angular-formly, go [here](https://github.com/formly-js/angular-formly)
