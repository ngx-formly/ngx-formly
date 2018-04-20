import { AppModule as DatetimeAppModule } from './app.module';
import { AppComponent as DatetimeAppComponent } from './app.component';

const DatetimeExampleConfig = {
  title: 'Datetime type',
  component: DatetimeAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  DatetimeAppModule,
  DatetimeAppComponent,
  DatetimeExampleConfig,
};
