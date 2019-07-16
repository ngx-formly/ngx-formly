import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { UserService } from './user.service';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  options: FormlyFormOptions = {};

  model;
  fields: FormlyFieldConfig[];

  constructor(private userService: UserService) {
    this.userService.getUserData().subscribe(([model, fields]) => {
      this.model = model;
      this.fields = fields;
    });
  }

  submit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
    }
  }
}
