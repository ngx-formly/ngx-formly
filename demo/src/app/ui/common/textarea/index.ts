import { AppComponent as TextareaAppComponent } from './app.component';
import { AppModule as TextareaAppModule } from './app.module';

const TextareaExampleConfig = {
  title: 'Textarea type',
  component: TextareaAppComponent,
  debug: false,
  files: [
    { file: 'app.component.html', content: require('!!prismjs-loader?lang=html!./app.component.html') },
    { file: 'app.component.ts', content: require('!!prismjs-loader?lang=typescript!./app.component.ts') },
    { file: 'app.module.ts', content: require('!!prismjs-loader?lang=typescript!./app.module.ts') },
  ],
};

export {
  TextareaAppModule,
  TextareaAppComponent,
  TextareaExampleConfig,
};
