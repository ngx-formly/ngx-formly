import { AppModule as ToggleAppModule } from './app.module';
import { AppComponent as ToggleAppComponent } from './app.component';

const ToggleExampleConfig = {
  title: 'Toggle type',
  component: ToggleAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  ToggleAppModule,
  ToggleAppComponent,
  ToggleExampleConfig,
};
