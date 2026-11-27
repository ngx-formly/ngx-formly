import appConfigTsSource from './app.config.ts?raw' with { loader: 'text' };
import additionalTypesComponentTsSource from './additional-types.component.ts?raw' with { loader: 'text' };
import { AdditionalExampleConfigs } from '../common/additional-examples';
import { DatepickerExampleConfig } from './datepicker';

export const additionalExamples = AdditionalExampleConfigs.map((example) =>
  example.title === 'Datepicker type'
    ? DatepickerExampleConfig
    : {
        ...example,
        files: [
          ...example.files,
          { file: 'app.config.ts', filecontent: appConfigTsSource },
          { file: 'additional-types.component.ts', filecontent: additionalTypesComponentTsSource },
        ],
      },
);
