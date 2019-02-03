import { AppModule as RangeAppModule } from './app.module';
import { AppComponent as RangeAppComponent } from './app.component';

const RangeExampleConfig = {
  title: 'Range type',
  component: RangeAppComponent,
  debug: true,
  files: [
    { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
    { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
  ],
};

export {
  RangeAppModule,
  RangeAppComponent,
  RangeExampleConfig,
};
