import { AppModule as InputAppModule } from './app.module';
import { AppComponent as InputAppComponent } from './app.component';

const InputExampleConfig = {
  title: 'Input type',
  component: InputAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  InputAppModule,
  InputAppComponent,
  InputExampleConfig,
};
