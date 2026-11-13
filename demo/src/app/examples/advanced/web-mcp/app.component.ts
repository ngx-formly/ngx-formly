import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  readonly config = inject(FormlyConfig);
  readonly submitted = signal(false);
  form = new FormGroup({});
  model = { name: '', email: '', privateReference: 'internal-123', people: [{ name: 'Ada', id: 'person-1' }] };
  options: FormlyFormOptions = {
    webMcp: { name: 'registration', description: 'Complete this example registration form.' },
  };
  fields: FormlyFieldConfig[] = [
    { key: 'name', type: 'input', props: { label: 'Name, follows the library default', required: true } },
    {
      key: 'email',
      type: 'input',
      webMcp: true,
      props: { label: 'Email, always included', type: 'email', required: true },
    },
    {
      key: 'privateReference',
      type: 'input',
      webMcp: false,
      props: { label: 'Private reference, excluded', readonly: true },
    },
    {
      key: 'profile',
      webMcp: false,
      fieldGroup: [
        {
          key: 'nickname',
          type: 'input',
          webMcp: true,
          props: { label: 'Nickname, opted back into an excluded group' },
        },
        { key: 'notes', type: 'textarea', props: { label: 'Private notes, inherits the group exclusion' } },
      ],
    },
    {
      key: 'password',
      type: 'input',
      webMcp: true,
      props: { label: 'Example password, values never returned', type: 'password' },
    },
    {
      key: 'people',
      type: 'repeat',
      webMcp: true,
      fieldArray: {
        fieldGroup: [
          { key: 'name', type: 'input', props: { label: 'Person name' } },
          { key: 'id', type: 'input', webMcp: false, props: { label: 'Person ID, excluded', readonly: true } },
        ],
      },
    },
  ];

  allowSubmission(allowed: boolean) {
    this.options.webMcp = { ...this.options.webMcp, submit: allowed ? () => this.save() : undefined };
  }

  save() {
    if (this.form.valid) this.submitted.set(true);
  }
}
