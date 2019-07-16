import { AppModule as ToggleAppModule } from './app.module';
import { AppComponent as ToggleAppComponent } from './app.component';

const ToggleExampleConfig = {
  title: 'Toggle type',
  component: ToggleAppComponent,
  debug: true,
  files: [
    { file: 'app.component.html', content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'), filecontent: require('!!raw-loader!./app.component.html') },
    { file: 'app.component.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'), filecontent: require('!!raw-loader!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!highlight-loader?raw=true&lang=typescript!./app.module.ts'), filecontent: require('!!raw-loader!./app.module.ts') },
  ],
};

export {
  ToggleAppModule,
  ToggleAppComponent,
  ToggleExampleConfig,
};
