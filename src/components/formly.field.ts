import {
    Component, OnInit, Input, Output, EventEmitter, DynamicComponentLoader, ElementRef,
    DoCheck
} from 'angular2/core';
import {FormlyCommon} from './formly.common.component';
import {FormlyConfig} from "../services/formly.config";
import {FormlyEventEmitter, FormlyPubSub} from "../services/formly.event.emitter";

@Component({
    selector: 'formly-field',
    template: `
        <div #child></div>
        <div *ngIf="field.template" [innerHtml]="field.template"></div>
         <div class="formly-field"
            *ngFor="#f of field.fieldGroup">
            <formly-field [hide]="f.hideExpression" [model]="model" [key]="f.key" [form]="form" [field]="f" (changeFn)="changeFunction($event, f)" [ngClass]="f.className"></formly-field>
        </div> 
    `,
    directives: [FormlyField]
})
export class FormlyField extends FormlyCommon implements OnInit, DoCheck {
    //Inputs and Outputs
    @Input() model;
    @Input() key;
    @Input() form;
    @Input() field;
    
    //Outputs
    @Output() changeFn: EventEmitter<any> = new EventEmitter();
    
    //Local Variables
    directives;
    hide;
    update;

    constructor(protected dcl: DynamicComponentLoader, protected elem: ElementRef, fc: FormlyConfig, protected ps: FormlyPubSub) {
        super();
        this.directives = fc.getDirectives();
     }
    ngOnInit() {
        if(this.field.hideExpression) {
            this.hide = true;
        } else {
            this.hide = false;
        }
        if(!!this.field.hideExpression || this.field.hideExpression === undefined && !this.field.template && !this.field.fieldGroup) {
            this.update = new FormlyEventEmitter();
            this.ps.setEmitter(this.key, this.update);
            this.dcl.loadIntoLocation(this.directives[this.field.type], this.elem, 'child').then(ref => {
                ref.instance.model = this.model[this.field.key];
                ref.instance.type = this.field.type;
                ref.instance.options = this.field.templateOptions;
                ref.instance.changeFn.subscribe((value)=> {
                    this.changeFn.emit(value);
                });
                ref.instance.key = this.key;
                ref.instance.form = this.form;
                ref.instance.update = this.update;
            });
        }
    }
    toggleFn(cond) {
        this.elem.nativeElement.style.display = cond ? '' : 'none';
        if (this.field.fieldGroup) {
            for (var i = 0; i < this.field.fieldGroup.length; i++) {
                this.ps.getEmitter([this.field.fieldGroup[i].key]).emit({
                    key: 'hidden',
                    value: !cond
                });
            }
        } else {
            this.ps.getEmitter(this.field.key).emit({
                key: 'hidden',
                value: !cond
            })
        }
    }
    ngDoCheck() {
        if(this.field.hideExpression !== undefined && this.field.hideExpression !== this.hide)  {
            this.hide = this.field.hideExpression;
            if(this.hide) {
                this.toggleFn(false);
            } else {
                this.toggleFn(true);
            }
        }
    }
}