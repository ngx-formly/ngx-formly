import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import additionalTypesComponentTsSource from './additional-types.component.ts?raw' with { loader: 'text' };
import { AdditionalExampleConfigs } from '../common/additional-examples';

export const additionalExamples = AdditionalExampleConfigs.map((example) => ({
  ...example,
  files: [
    ...example.files.filter((file) => file.file !== 'app.config.ts'),
    {
      file: 'app.config.ts',
      filecontent: appConfigTsSource,
    },
    {
      file: 'additional-types.component.ts',
      filecontent: additionalTypesComponentTsSource,
    },
  ],
}));
