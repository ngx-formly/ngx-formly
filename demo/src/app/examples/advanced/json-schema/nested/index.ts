import { AppModule as NestedAppModule } from './app.module';
import { AppComponent as NestedAppComponent } from './app.component';

const NestedExampleConfig = {
  title: 'Nested',
  component: NestedAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html'), filecontent: require('!!raw-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader?lang=typescript!./app.module.ts') },
    { file: 'array.type.ts', content: require('!!prismjs-loader?lang=typescript!./array.type.ts'), filecontent: require('!!raw-loader?lang=typescript!./array.type.ts') },
  ],
};

export {
  NestedAppModule,
  NestedAppComponent,
  NestedExampleConfig,
};
