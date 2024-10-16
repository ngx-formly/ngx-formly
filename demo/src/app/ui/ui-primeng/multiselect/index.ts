import { AppModule as SelectAppModule } from './app.module';
import { AppComponent as MultiSelectAppComponent } from './app.component';

const MultiSelectExampleConfig = {
  title: 'Multiselect type',
  component: MultiSelectAppComponent,
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
      file: 'app.module.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'),
      filecontent: require('!!raw-loader!./app.module.ts'),
    },
  ],
};

export { SelectAppModule, MultiSelectAppComponent as SelectAppComponent, MultiSelectExampleConfig };
