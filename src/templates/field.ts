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
  _viewModel: any;

  // FIXME: See https://github.com/formly-js/ng2-formly/issues/45. This is a temporary fix.
  _viewModelUpdateReceiver: EventEmitter<any>;
  set viewModelUpdateReceiver(viewModelUpdateReceiver: EventEmitter<any>) {
    this._viewModelUpdateReceiver = viewModelUpdateReceiver;
    this._viewModelUpdateReceiver.subscribe((viewModel: any) => {
      this.viewModel = viewModel;
    });
  }

  @Input()
  public get viewModel(): any {
    return this._viewModel;
  }

  public set viewModel(value: any) {
    this._viewModel = value;
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
    this._viewModel = e.target[val];
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
    return new Control(this._viewModel || "", this.field.validation);
  }
}
