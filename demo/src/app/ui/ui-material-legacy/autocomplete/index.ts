import { AppModule as AutocompleteAppModule } from './app.module';
import { AppComponent as AutocompleteAppComponent } from './app.component';

const AutocompleteExampleConfig = {
  title: 'Autocomplete type',
  component: AutocompleteAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'),
      filecontent: require('!!raw-loader!./app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'),
      filecontent: require('!!raw-loader!./app.component.ts'),
    },
    {
      file: 'app.module.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'),
      filecontent: require('!!raw-loader!./app.module.ts'),
    },
    {
      file: 'autocomplete-type.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./autocomplete-type.component.ts'),
      filecontent: require('!!raw-loader!./autocomplete-type.component.ts'),
    },
  ],
};

export { AutocompleteAppModule, AutocompleteAppComponent, AutocompleteExampleConfig };
