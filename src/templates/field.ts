import {Output, Input, EventEmitter, OnInit, Renderer} from "@angular/core";
import {FormlyMessages} from "./../services/formly.messages";
import {FormlyPubSub, FormlyValueChangeEvent} from "./../services/formly.event.emitter";
import {FormlyTemplateOptions, FormlyFieldConfig} from "../components/formly.field.config";
import {FormControl, AbstractControl} from "@angular/forms";
import {SingleFocusDispatcher} from "../services/formly.single.focus.dispatcher";


export abstract class Field implements OnInit {

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
  protected _focus: boolean;

  // FIXME: See https://github.com/formly-js/ng2-formly/issues/45. This is a temporary fix.
  _modelUpdateReceiver: EventEmitter<any>;
  public set modelUpdateReceiver(modelUpdateReceiver: EventEmitter<any>) {
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

  constructor(fm: FormlyMessages, protected ps: FormlyPubSub, protected renderer: Renderer,
              protected focusDispatcher: SingleFocusDispatcher) {
    this.messages = fm.getMessages();
    this.ps.Stream.subscribe(form => {
      this.form = form;
    });

    focusDispatcher.listen((key: String) => {
      if (this.key !== key) {
        this.focus = false;
      }
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
    this.model = e.target[val];
    this.changeFn.emit(new FormlyValueChangeEvent(this.key, e.target[val]));
    this.ps.setUpdated(true);
  }

  get formControl(): AbstractControl {
    if (!this._control) {
     this.createControl();
    }
    return this._control;
  }

  createControl(): void {
    this._control = new FormControl(this._model || "", this.field.validation);
  }

  ngAfterViewInit() {
    if (this.templateOptions.focus) {
      this.focus = true;
    }
  }

  public set focus (newFocusValue: boolean) {
    if (!this._focus && newFocusValue) {
      this._focus = true;
      this.setNativeFocusProperty(this._focus);
      this.focusDispatcher.notify(this.key);
      // TODO: Raise a Event which can be used for streaming
    } else if (this._focus && !newFocusValue) {
      this._focus = false;
      // TODO: Raise a Event which can be used for streaming
    }
  }

  protected abstract setNativeFocusProperty(newFocusValue: boolean): void;

  public get focus (): boolean {
    return this._focus;
  }

  public onInputFocus(): void {
    this.focus = true;
  }
}
