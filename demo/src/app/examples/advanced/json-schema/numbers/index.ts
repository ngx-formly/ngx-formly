import { AppModule as NumbersAppModule } from './app.module';
import { AppComponent as NumbersAppComponent } from './app.component';

const NumbersExampleConfig = {
  title: 'Numbers',
  component: NumbersAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
    { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./array.type.ts') },
  ],
};

export {
  NumbersAppModule,
  NumbersAppComponent,
  NumbersExampleConfig,
};
