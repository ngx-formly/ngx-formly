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
  model = {};
  locked = signal(false);
  cityLabel = computed(() => (this.locked() ? 'City (locked)' : 'City'));
  fields: FormlyFieldConfig[] = [
    {
      key: 'city',
      type: 'input',
      expressions: {
        'props.disabled': this.locked,
        'props.label': this.cityLabel,
      },
    },
  ];

  toggleLocked() {
    this.locked.update((locked) => !locked);
  }
}
