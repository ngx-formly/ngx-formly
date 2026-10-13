import appComponentHtmlSource from '../../common/native-select/app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from '../../common/native-select/app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { AppComponent as NativeSelectAppComponent } from '../../common/native-select/app.component';
import { appConfig as NativeSelectAppConfig } from './app.config';

const NativeSelectExampleConfig = {
  title: 'NativeSelect type',
  component: NativeSelectAppComponent,
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

export { NativeSelectAppConfig, NativeSelectAppComponent, NativeSelectExampleConfig };
