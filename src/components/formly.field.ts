import {Component, OnInit, DoCheck, Input, Output, EventEmitter, DynamicComponentLoader, ElementRef, Injector} from 'angular2/core';
import {TemplateDirectives} from './../templates/templates';
import {FormlyPubSub} from './../services/formly.event.emitter';

@Component({
    selector: 'formly-field',
    template: `
        <div #child></div>
        <div *ngIf="field.template" [innerHtml]="field.template"></div>
         <div class="formly-field"
            *ngFor="#f of field.fieldGroup"
            [ngClass]="f.className">
            <formly-field [hide]="f.hideExpression" [type]="f.type"  [key]="f.key" [form]="form" [options]="f.templateOptions" [field]="f" (changeFn)="changeFunction($event, f)"></formly-field>
        </div> 
    `,
    directives: [FormlyField]
})
export class FormlyField implements OnInit {
    //Inputs and Outputs
    @Input() type;
    @Input() model;
    @Input() options;
    @Input() key;
    @Input() form;
    @Input() hide;
    @Input() field;
    
    //Outputs
    @Output() changeFn: EventEmitter<any> = new EventEmitter();
    
    //Local Variables
    component;
    constructor(protected dcl: DynamicComponentLoader, protected elem: ElementRef, private ps: FormlyPubSub) { }
    ngOnInit() {
        if(!!this.hide || this.hide === undefined && !this.field.template && !this.field.fieldGroup) {
            this.component = this.dcl.loadIntoLocation(TemplateDirectives[this.type], this.elem, 'child').then(ref => {
                ref.instance.model = this.model;
                ref.instance.type = this.type;
                ref.instance.options = this.options;
                ref.instance.changeFn.subscribe((value)=> {
                    this.changeFn.emit(value);
                });
                ref.instance.key = this.key;
                ref.instance.form = this.form;
            });
        }
    }
}