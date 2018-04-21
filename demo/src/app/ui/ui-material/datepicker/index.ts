import { AppModule as DatepickerAppModule } from './app.module';
import { AppComponent as DatepickerAppComponent } from './app.component';

const DatepickerExampleConfig = {
  title: 'Datepicker type',
  component: DatepickerAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  DatepickerAppModule,
  DatepickerAppComponent,
  DatepickerExampleConfig,
};
