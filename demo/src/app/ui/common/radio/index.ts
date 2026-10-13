import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import { AppComponent as RadioAppComponent } from './app.component';

const RadioExampleConfig = {
  title: 'Radio type',
  component: RadioAppComponent,
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

export { RadioAppComponent, RadioExampleConfig };
