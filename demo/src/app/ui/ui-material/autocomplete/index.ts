import appComponentHtmlSource from '../../common/autocomplete/app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from '../../common/autocomplete/app.component.ts?raw' with { loader: 'text' };
import autocompleteTypeComponentTsSource from './autocomplete-type.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { AppComponent as AutocompleteAppComponent } from '../../common/autocomplete/app.component';
import { appConfig as AutocompleteAppConfig } from './app.config';

const AutocompleteExampleConfig = {
  title: 'Autocomplete type',
  component: AutocompleteAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      filecontent: appComponentHtmlSource,
    },
    {
      file: 'app.component.ts',
      filecontent: appComponentTsSource,
    },
    {
      file: 'autocomplete-type.component.ts',
      filecontent: autocompleteTypeComponentTsSource,
    },
    {
      file: 'app.config.ts',
      filecontent: appConfigTsSource,
    },
  ],
};

export { AutocompleteAppConfig, AutocompleteAppComponent, AutocompleteExampleConfig };
