import { AppComponent as NativeSelectAppComponent } from '../../common/native-select/app.component';
import { appConfig as NativeSelectAppConfig } from './app.config';

const NativeSelectExampleConfig = {
  title: 'NativeSelect type',
  component: NativeSelectAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!../../common/native-select/app.component.html'),
      filecontent: require('!!raw-loader!../../common/native-select/app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!../../common/native-select/app.component.ts'),
      filecontent: require('!!raw-loader!../../common/native-select/app.component.ts'),
    },
    {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
  ],
};

export { NativeSelectAppConfig, NativeSelectAppComponent, NativeSelectExampleConfig };
