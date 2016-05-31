import {Output, Input, EventEmitter, OnInit, OnChanges} from "@angular/core";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";
import {Control, AbstractControl} from "@angular/common";


export class Field implements OnInit {

  @Input() form;
  @Input() update;
  @Input() templateOptions: FormlyTemplateOptions;
  @Input() key: string;
  @Input() field: FormlyFieldConfig;
  @Input() formModel: any;

  @Output() changeFn: EventEmitter<any> = new EventEmitter();


  messages;
  _control: AbstractControl;
  _model: any;

  // FIXME: See https://github.com/formly-js/ng2-formly/issues/45. This is a temporary fix.
  _modelUpdateReceiver: EventEmitter<any>;
  set modelUpdateReceiver(modelUpdateReceiver: EventEmitter<any>) {
    this._modelUpdateReceiver = modelUpdateReceiver;
    this._modelUpdateReceiver.subscribe((model: any) => {
      this.model = model;
    });
  }

  @Input()
  public get model(): any {
    return this._model;
  }

  public set model(value: any) {
    this._model = value;
  }

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
    this._model = e.target[val];
    this.changeFn.emit(new FormlyValueChangeEvent(this.key, e.target[val]));
    this.ps.setUpdated(true);
  }

  get formControl(): AbstractControl {
    if (!this._control) {
     this._control = this.createControl();
    }
    return this._control;
  }

  createControl(): AbstractControl {
    return new Control(this._model || "", this.field.validation);
  }
}
