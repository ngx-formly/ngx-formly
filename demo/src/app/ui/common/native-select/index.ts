import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import { AppComponent as NativeSelectAppComponent } from './app.component';

export const NativeSelectExampleConfig = {
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
  ],
};
