import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { AppComponent as RangeAppComponent } from './app.component';
import { appConfig as RangeAppConfig } from './app.config';

const RangeExampleConfig = {
  title: 'Range type',
  component: RangeAppComponent,
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
      file: 'app.config.ts',
      filecontent: appConfigTsSource,
    },
  ],
};

export { RangeAppConfig, RangeAppComponent, RangeExampleConfig };
