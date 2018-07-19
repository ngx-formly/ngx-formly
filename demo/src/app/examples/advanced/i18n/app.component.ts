import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'lang',
      type: 'select',
      templateOptions: {
        required: true,
        change: (field) => this.translate.use(field.formControl.value),
        options: [
          { label: 'fr', value: 'fr' },
          { label: 'en', value: 'en' },
        ],
      },
      expressionProperties: {
        'templateOptions.label': this.translate.stream('HOME.SELECT'),
      },
    },
  ];

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();

    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    this.model.lang = translate.currentLang;
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
