import {FormlyPubSub} from "./formly.event.emitter";
import {FormlyMessages} from "./formly.messages";
import {SingleFocusDispatcher} from "./formly.single.focus.dispatcher";

export const FormlyProviders = [
  FormlyPubSub,
  FormlyMessages,
  SingleFocusDispatcher
];
