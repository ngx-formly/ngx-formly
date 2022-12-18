import { FormlyMatSliderModule } from './slider.module';
import { FormlyFieldSlider as LegacyFormlyFieldSlider, FormlySliderFieldConfig } from './slider.type';
import { FormlyFieldMDCSlider } from './slider-mdc.type';

import { VERSION } from '@angular/cdk';

const FormlyFieldSlider = Number(VERSION.major) >= 15 ? FormlyFieldMDCSlider : LegacyFormlyFieldSlider;
export { FormlyMatSliderModule, FormlyFieldSlider, FormlySliderFieldConfig };
