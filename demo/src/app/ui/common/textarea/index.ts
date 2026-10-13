import appComponentHtmlSource from './app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from './app.component.ts?raw' with { loader: 'text' };
import { AppComponent as TextareaAppComponent } from './app.component';

const TextareaExampleConfig = {
  title: 'Textarea type',
  component: TextareaAppComponent,
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

export { TextareaAppComponent, TextareaExampleConfig };
