import { AppModule as AutocompleteAppModule } from './app.module';
import { AppComponent as AutocompleteAppComponent } from './app.component';

const AutocompleteExampleConfig = {
  title: 'Autocomplete type',
  component: AutocompleteAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
    { file: 'autocomplete-type.component.ts', content: require('!!prismjs-loader?lang=typescript!./autocomplete-type.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./autocomplete-type.component.ts') },
  ],
};

export {
  AutocompleteAppModule,
  AutocompleteAppComponent,
  AutocompleteExampleConfig,
};
