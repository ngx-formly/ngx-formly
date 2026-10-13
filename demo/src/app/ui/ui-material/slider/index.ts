import appComponentHtmlSource from '../../common/slider/app.component.html?raw' with { loader: 'text' };
import appComponentTsSource from '../../common/slider/app.component.ts?raw' with { loader: 'text' };
import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import { AppComponent as SliderAppComponent } from '../../common/slider/app.component';
import { appConfig as SliderAppConfig } from './app.config';

const SliderExampleConfig = {
  title: 'Slider type',
  component: SliderAppComponent,
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

export { SliderAppConfig, SliderAppComponent, SliderExampleConfig };
