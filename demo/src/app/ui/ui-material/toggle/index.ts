import { AppComponent as ToggleAppComponent } from '../../common/toggle/app.component';
import { appConfig as ToggleAppConfig } from './app.config';

const ToggleExampleConfig = {
  title: 'Toggle type',
  component: ToggleAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!../../common/toggle/app.component.html'),
      filecontent: require('!!raw-loader!../../common/toggle/app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!../../common/toggle/app.component.ts'),
      filecontent: require('!!raw-loader!../../common/toggle/app.component.ts'),
    },
    {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
  ],
};

export { ToggleAppConfig, ToggleAppComponent, ToggleExampleConfig };
