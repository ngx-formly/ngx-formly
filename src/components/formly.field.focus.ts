import {Directive, ElementRef, Input, Renderer} from "@angular/core";

@Directive({selector: "[formlyNgFocus]"})
export class FormlyNgFocus {
  _focus: boolean;

  @Input("formlyNgFocus")
  set focus(val: boolean) {
    this._focus = val;
    if (val) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, "focus", []);
    } else {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, "blur", []);
    }
  }
  get focus() { return this._focus; }

  constructor(private renderer: Renderer, private elementRef: ElementRef) {}
}
