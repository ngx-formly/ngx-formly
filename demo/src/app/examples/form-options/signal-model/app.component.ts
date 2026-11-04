import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class AppComponent {
  form = new FormGroup({});
  model = signal({ firstName: 'Ada', lastName: 'Lovelace' });
  fullName = computed(() => `${this.model().firstName} ${this.model().lastName}`.trim());
  fields: FormlyFieldConfig[] = [
    { key: 'firstName', type: 'input', props: { label: 'First name' } },
    { key: 'lastName', type: 'input', props: { label: 'Last name' } },
  ];

  loadModel() {
    this.model.set({ firstName: 'Grace', lastName: 'Hopper' });
  }
}
