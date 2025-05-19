import { AppComponent as InputAppComponent } from './app.component';

const InputExampleConfig = {
  title: 'Input type',
  component: InputAppComponent,
  debug: true,
  files: [
    {
      file: 'app.component.html',
      content: require('!!highlight-loader?raw=true&lang=html!./app.component.html'),
      filecontent: require('!!raw-loader!./app.component.html'),
    },
    {
      file: 'app.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.component.ts'),
      filecontent: require('!!raw-loader!./app.component.ts'),
    },
  ],
};

export { InputAppComponent, InputExampleConfig };
