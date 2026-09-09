import { AdditionalExampleConfigs } from '../common/additional-examples';
import { DatepickerExampleConfig } from './datepicker';

export const additionalExamples = AdditionalExampleConfigs.map((example) => ({
  ...example,
  ...(example.title === 'Datepicker type' ? DatepickerExampleConfig : {}),
  files: [
    ...(example.title === 'Datepicker type' ? DatepickerExampleConfig.files : example.files).filter(
      (file) => file.file !== 'app.config.ts',
    ),
    {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./app.config.ts'),
      filecontent: require('!!raw-loader!./app.config.ts'),
    },
    {
      file: 'additional-types.component.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!./additional-types.component.ts'),
      filecontent: require('!!raw-loader!./additional-types.component.ts'),
    },
  ],
}));
