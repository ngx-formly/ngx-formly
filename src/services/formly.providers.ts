import {ControlService} from './control.service';
import {FormlyPubSub} from './formly.event.emitter';
import {FormlyMessages} from './formly.messages';

export const FormlyProviders = [
    ControlService,
    FormlyPubSub,
    FormlyMessages
]