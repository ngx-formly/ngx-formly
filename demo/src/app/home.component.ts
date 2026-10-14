import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { highlight } from './shared/highlight';

@Component({
  selector: 'formly-demo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [JsonPipe, ReactiveFormsModule, RouterLink, MatIcon, FormlyForm],
  standalone: true,
})
export class HomeComponent {
  form = new FormGroup({});
  model = { name: 'Alex', email: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name', required: true },
    },
    {
      key: 'email',
      type: 'input',
      props: { label: 'Email', type: 'email' },
    },
  ];
  schema = highlight(JSON.stringify(this.fields, null, 2), 'json');
}
