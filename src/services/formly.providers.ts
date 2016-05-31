import {FormlyPubSub} from "./formly.event.emitter";
import {FormlyMessages} from "./formly.messages";
import {FormlyFieldBuilder} from "./formly.field.builder";

export const FormlyProviders = [
  FormlyPubSub,
  FormlyMessages,
  FormlyFieldBuilder
];
