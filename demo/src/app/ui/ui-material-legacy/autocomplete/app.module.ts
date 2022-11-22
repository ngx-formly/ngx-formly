import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';

import { AppComponent } from './app.component';
import { AutocompleteTypeComponent } from './autocomplete-type.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatLegacyInputModule,
    MatLegacyAutocompleteModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'autocomplete',
          component: AutocompleteTypeComponent,
          wrappers: ['form-field'],
        },
      ],
      validationMessages: [{ name: 'required', message: 'This field is required' }],
    }),
  ],
  declarations: [AutocompleteTypeComponent, AppComponent],
})
export class AppModule {}
