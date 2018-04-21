import { AppModule as SelectAppModule } from './app.module';
import { AppComponent as SelectAppComponent } from './app.component';

const SelectExampleConfig = {
  title: 'Select type',
  component: SelectAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  SelectAppModule,
  SelectAppComponent,
  SelectExampleConfig,
};
