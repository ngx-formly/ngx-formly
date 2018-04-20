import { AppModule as RangeAppModule } from './app.module';
import { AppComponent as RangeAppComponent } from './app.component';

const RangeExampleConfig = {
  title: 'Range type',
  component: RangeAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  RangeAppModule,
  RangeAppComponent,
  RangeExampleConfig,
};
