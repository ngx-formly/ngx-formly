import { AppModule as NestedAppModule } from './app.module';
import { AppComponent as NestedAppComponent } from './app.component';

const NestedExampleConfig = {
  title: 'Nested',
  component: NestedAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
    { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
    { file: 'array.type.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./array.type.ts'), filecontent: require('!!raw-loader!./array.type.ts') },
  ],
};

export {
  NestedAppModule,
  NestedAppComponent,
  NestedExampleConfig,
};
