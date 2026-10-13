import appComponentHtmlSource from '../../common/toggle/app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from '../../common/toggle/app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { AppComponent as ToggleAppComponent } from '../../common/toggle/app.component';
import { appConfig as ToggleAppConfig } from './app.config';

const ToggleExampleConfig = {
  title: 'Toggle type',
  component: ToggleAppComponent,
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

export { ToggleAppConfig, ToggleAppComponent, ToggleExampleConfig };
