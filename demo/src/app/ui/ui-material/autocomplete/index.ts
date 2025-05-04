import { AppComponent as AutocompleteAppComponent } from './app.component';
import { appConfig as AutocompleteAppConfig } from './app.config';

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
      file: 'autocomplete-type.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./autocomplete-type.component.ts'),
      filecontent: require('!!raw-loader!./autocomplete-type.component.ts'),
    },
    {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
  ],
};

export { AutocompleteAppConfig, AutocompleteAppComponent, AutocompleteExampleConfig };
