import {Output, Input, EventEmitter, OnInit} from "@angular/core";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub} from "./../services/formly.event.emitter";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.config";
import {Control, AbstractControl} from "@angular/common";


export class Field implements OnInit {

  @Input() form;
  @Input() update;
  @Input() templateOptions: FormlyTemplateOptions;
  @Input() key: string;
  @Input() field: FormlyFieldConfig;
  model: any;
  formModel: any;

  @Output() changeFn: EventEmitter<any> = new EventEmitter();


  messages;
  _control: AbstractControl;
  constructor(fm: FormlyMessages, private ps: FormlyPubSub) {
    this.messages = fm.getMessages();
    this.ps.Stream.subscribe(form => {
      this.form = form;
    });
  }
  ngOnInit() {
    if (this.update) {
      this.update.subscribe((update) => {
        this.templateOptions[update.key] = update.value;
      });
    }
   }
  inputChange(e, val) {
    this.changeFn.emit(e.target[val]);
    this.ps.setUpdated(true);
  }

  get formControl(): AbstractControl {
    if (!this._control) {
     this._control = this.createControl();
    }
    return this._control;
  }

  createControl(): AbstractControl {
    return new Control(this.model || "", this.field.validation);
  }
}
