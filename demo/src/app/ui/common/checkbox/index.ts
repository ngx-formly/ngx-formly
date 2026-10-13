import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import { AppComponent as CheckboxAppComponent } from './app.component';

const CheckboxExampleConfig = {
  title: 'Checkbox type',
  component: CheckboxAppComponent,
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

export { CheckboxAppComponent, CheckboxExampleConfig };
