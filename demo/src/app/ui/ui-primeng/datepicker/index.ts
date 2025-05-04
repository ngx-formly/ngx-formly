import { AppComponent as DatepickerAppComponent } from './app.component';
import { appConfig as DatepickerAppConfig } from './app.config';

const DatepickerExampleConfig = {
  title: 'Datepicker type',
  component: DatepickerAppComponent,
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
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
  ],
};

export { DatepickerAppConfig, DatepickerAppComponent, DatepickerExampleConfig };
