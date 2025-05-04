import { AppComponent as NativeSelectAppComponent } from './app.component';
import { appConfig as NativeSelectAppConfig } from './app.config';

const NativeSelectExampleConfig = {
  title: 'NativeSelect type',
  component: NativeSelectAppComponent,
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

export { NativeSelectAppConfig, NativeSelectAppComponent, NativeSelectExampleConfig };
