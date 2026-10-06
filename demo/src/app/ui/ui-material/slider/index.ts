import { AppComponent as SliderAppComponent } from '../../common/slider/app.component';
import { appConfig as SliderAppConfig } from './app.config';

const SliderExampleConfig = {
  title: 'Slider type',
  component: SliderAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!../../common/slider/app.component.html'),
      filecontent: require('!!raw-loader!../../common/slider/app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!../../common/slider/app.component.ts'),
      filecontent: require('!!raw-loader!../../common/slider/app.component.ts'),
    },
    {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
  ],
};

export { SliderAppConfig, SliderAppComponent, SliderExampleConfig };
