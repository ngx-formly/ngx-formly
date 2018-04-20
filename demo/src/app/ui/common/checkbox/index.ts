import { AppModule as CheckboxAppModule } from './app.module';
import { AppComponent as CheckboxAppComponent } from './app.component';

const CheckboxExampleConfig = {
  title: 'Checkbox type',
  component: CheckboxAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  CheckboxAppModule,
  CheckboxAppComponent,
  CheckboxExampleConfig,
};
