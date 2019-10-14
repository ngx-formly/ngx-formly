(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ui-bootstrap-module"],{

/***/ "../../src/ui/bootstrap/addons/src/addon.extension.ts":
/*!*****************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/addons/src/addon.extension.ts ***!
  \*****************************************************************************************/
/*! exports provided: addonsExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addonsExtension", function() { return addonsExtension; });
function addonsExtension(field) {
    if (!field.templateOptions || (field.wrappers && field.wrappers.indexOf('addons') !== -1)) {
        return;
    }
    if (field.templateOptions.addonLeft || field.templateOptions.addonRight) {
        field.wrappers = [...(field.wrappers || []), 'addons'];
    }
}


/***/ }),

/***/ "../../src/ui/bootstrap/addons/src/addons.component.ts":
/*!******************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/addons/src/addons.component.ts ***!
  \******************************************************************************************/
/*! exports provided: FormlyWrapperAddons */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyWrapperAddons", function() { return FormlyWrapperAddons; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");




function FormlyWrapperAddons_div_1_i_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i", 8);
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r3.to.addonLeft.class);
} }
function FormlyWrapperAddons_div_1_span_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r4.to.addonLeft.text);
} }
const _c0 = function (a0) { return { cursor: a0 }; };
function FormlyWrapperAddons_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FormlyWrapperAddons_div_1_Template_div_click_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r5.addonLeftClick($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyWrapperAddons_div_1_i_1_Template, 1, 1, "i", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyWrapperAddons_div_1_span_2_Template, 2, 1, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](3, _c0, ctx_r0.to.addonLeft.onClick ? "pointer" : "inherit"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.to.addonLeft.class);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.to.addonLeft.text);
} }
function FormlyWrapperAddons_div_5_i_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i", 8);
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r7.to.addonRight.class);
} }
function FormlyWrapperAddons_div_5_span_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r8.to.addonRight.text);
} }
function FormlyWrapperAddons_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FormlyWrapperAddons_div_5_Template_div_click_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r9.addonRightClick($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyWrapperAddons_div_5_i_1_Template, 1, 1, "i", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyWrapperAddons_div_5_span_2_Template, 2, 1, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](3, _c0, ctx_r2.to.addonRight.onClick ? "pointer" : "inherit"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.to.addonRight.class);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.to.addonRight.text);
} }
class FormlyWrapperAddons extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldWrapper"] {
    addonRightClick($event) {
        if (this.to.addonRight.onClick) {
            this.to.addonRight.onClick(this.to, this, $event);
        }
    }
    addonLeftClick($event) {
        if (this.to.addonLeft.onClick) {
            this.to.addonLeft.onClick(this.to, this, $event);
        }
    }
}
FormlyWrapperAddons.ɵfac = function FormlyWrapperAddons_Factory(t) { return ɵFormlyWrapperAddons_BaseFactory(t || FormlyWrapperAddons); };
FormlyWrapperAddons.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyWrapperAddons, selectors: [["formly-wrapper-addons"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 6, vars: 2, consts: [[1, "input-group"], ["class", "input-group-prepend", 3, "ngStyle", "click", 4, "ngIf"], [1, "input-addons"], ["fieldComponent", ""], ["class", "input-group-append", 3, "ngStyle", "click", 4, "ngIf"], [1, "input-group-prepend", 3, "ngStyle", "click"], ["class", "input-group-text", 3, "ngClass", 4, "ngIf"], ["class", "input-group-text", 4, "ngIf"], [1, "input-group-text", 3, "ngClass"], [1, "input-group-text"], [1, "input-group-append", 3, "ngStyle", "click"]], template: function FormlyWrapperAddons_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyWrapperAddons_div_1_Template, 3, 5, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainer"](3, null, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FormlyWrapperAddons_div_5_Template, 3, 5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.addonLeft);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.addonRight);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgStyle"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgClass"]], styles: ["[_nghost-%COMP%]     .input-group > :not(:first-child) .form-control {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n[_nghost-%COMP%]     .input-group > :not(:last-child) .form-control {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n[_nghost-%COMP%]     .input-group > .input-addons {\n  position: relative;\n  flex: 1 1 auto;\n  width: 1%;\n  margin-bottom: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FiZGVsL3d3dy9wcm9qZWN0L2Zvcm1seS9saWIvc3JjL3VpL2Jvb3RzdHJhcC9hZGRvbnMvc3JjL2FkZG9ucy5jb21wb25lbnQuc2NzcyIsInNyYy91aS9ib290c3RyYXAvYWRkb25zL3NyYy9hZGRvbnMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSx5QkFBQTtFQUNBLDRCQUFBO0FDQUo7QURFRTtFQUNFLDBCQUFBO0VBQ0EsNkJBQUE7QUNBSjtBREVFO0VBQ0Usa0JBQUE7RUFDQSxjQUFBO0VBQ0EsU0FBQTtFQUNBLGdCQUFBO0FDQUoiLCJmaWxlIjoic3JjL3VpL2Jvb3RzdHJhcC9hZGRvbnMvc3JjL2FkZG9ucy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IDo6bmctZGVlcCAuaW5wdXQtZ3JvdXAgPiB7XG4gIDpub3QoOmZpcnN0LWNoaWxkKSAuZm9ybS1jb250cm9sIHtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gIH1cbiAgOm5vdCg6bGFzdC1jaGlsZCkgLmZvcm0tY29udHJvbCB7XG4gICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG4gIH1cbiAgLmlucHV0LWFkZG9ucyB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIHdpZHRoOiAxJTtcbiAgICBtYXJnaW4tYm90dG9tOiAwO1xuICB9XG59XG4iLCI6aG9zdCA6Om5nLWRlZXAgLmlucHV0LWdyb3VwID4gOm5vdCg6Zmlyc3QtY2hpbGQpIC5mb3JtLWNvbnRyb2wge1xuICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xufVxuOmhvc3QgOjpuZy1kZWVwIC5pbnB1dC1ncm91cCA+IDpub3QoOmxhc3QtY2hpbGQpIC5mb3JtLWNvbnRyb2wge1xuICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG59XG46aG9zdCA6Om5nLWRlZXAgLmlucHV0LWdyb3VwID4gLmlucHV0LWFkZG9ucyB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZmxleDogMSAxIGF1dG87XG4gIHdpZHRoOiAxJTtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbn0iXX0= */"], changeDetection: 0 });
const ɵFormlyWrapperAddons_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyWrapperAddons);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyWrapperAddons, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-wrapper-addons',
                templateUrl: './addons.component.html',
                styleUrls: ['./addons.component.scss'],
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/addons/src/addons.module.ts":
/*!***************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/addons/src/addons.module.ts ***!
  \***************************************************************************************/
/*! exports provided: FormlyBootstrapAddonsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapAddonsModule", function() { return FormlyBootstrapAddonsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _addons_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addons.component */ "../../src/ui/bootstrap/addons/src/addons.component.ts");
/* harmony import */ var _addon_extension__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addon.extension */ "../../src/ui/bootstrap/addons/src/addon.extension.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");








class FormlyBootstrapAddonsModule {
}
FormlyBootstrapAddonsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapAddonsModule });
FormlyBootstrapAddonsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapAddonsModule_Factory(t) { return new (t || FormlyBootstrapAddonsModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                wrappers: [{ name: 'addons', component: _addons_component__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperAddons"] }],
                extensions: [{ name: 'addons', extension: { postPopulate: _addon_extension__WEBPACK_IMPORTED_MODULE_5__["addonsExtension"] } }],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapAddonsModule, { declarations: [_addons_component__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperAddons"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapAddonsModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_addons_component__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperAddons"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        wrappers: [{ name: 'addons', component: _addons_component__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperAddons"] }],
                        extensions: [{ name: 'addons', extension: { postPopulate: _addon_extension__WEBPACK_IMPORTED_MODULE_5__["addonsExtension"] } }],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/addons/src/public_api.ts":
/*!************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/addons/src/public_api.ts ***!
  \************************************************************************************/
/*! exports provided: FormlyBootstrapAddonsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _addons_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addons.module */ "../../src/ui/bootstrap/addons/src/addons.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapAddonsModule", function() { return _addons_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapAddonsModule"]; });




/***/ }),

/***/ "../../src/ui/bootstrap/checkbox/src/checkbox.module.ts":
/*!*******************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/checkbox/src/checkbox.module.ts ***!
  \*******************************************************************************************/
/*! exports provided: FormlyBootstrapCheckboxModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapCheckboxModule", function() { return FormlyBootstrapCheckboxModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _checkbox_type__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./checkbox.type */ "../../src/ui/bootstrap/checkbox/src/checkbox.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");








class FormlyBootstrapCheckboxModule {
}
FormlyBootstrapCheckboxModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapCheckboxModule });
FormlyBootstrapCheckboxModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapCheckboxModule_Factory(t) { return new (t || FormlyBootstrapCheckboxModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'checkbox',
                        component: _checkbox_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldCheckbox"],
                        wrappers: ['form-field'],
                    },
                    {
                        name: 'boolean',
                        extends: 'checkbox',
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapCheckboxModule, { declarations: [_checkbox_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldCheckbox"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapCheckboxModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_checkbox_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldCheckbox"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'checkbox',
                                component: _checkbox_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldCheckbox"],
                                wrappers: ['form-field'],
                            },
                            {
                                name: 'boolean',
                                extends: 'checkbox',
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/checkbox/src/checkbox.type.ts":
/*!*****************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/checkbox/src/checkbox.type.ts ***!
  \*****************************************************************************************/
/*! exports provided: FormlyFieldCheckbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldCheckbox", function() { return FormlyFieldCheckbox; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");






function FormlyFieldCheckbox_span_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
const _c0 = function (a0, a1, a2, a3, a4, a5) { return { "form-check": a0, "form-check-inline": a1, "custom-control": a2, "custom-checkbox": a3, "custom-control-inline": a4, "custom-switch": a5 }; };
class FormlyFieldCheckbox extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldType"] {
    constructor() {
        super(...arguments);
        this.defaultOptions = {
            templateOptions: {
                indeterminate: true,
                hideLabel: true,
                formCheck: 'custom',
            },
        };
    }
}
FormlyFieldCheckbox.ɵfac = function FormlyFieldCheckbox_Factory(t) { return ɵFormlyFieldCheckbox_BaseFactory(t || FormlyFieldCheckbox); };
FormlyFieldCheckbox.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldCheckbox, selectors: [["formly-field-checkbox"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 5, vars: 24, consts: [[3, "ngClass"], ["type", "checkbox", 3, "indeterminate", "formControl", "formlyAttributes"], [3, "for"], [4, "ngIf"]], template: function FormlyFieldCheckbox_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "input", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "label", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormlyFieldCheckbox_span_4_Template, 2, 0, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction6"](17, _c0, ctx.to.formCheck.indexOf("custom") === 0 - 1, ctx.to.formCheck === "inline", ctx.to.formCheck.indexOf("custom") === 0, ctx.to.formCheck === "custom" || ctx.to.formCheck === "custom-inline", ctx.to.formCheck === "custom-inline", ctx.to.formCheck === "custom-switch"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("is-invalid", ctx.showError)("form-check-input", ctx.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-input", ctx.to.formCheck.indexOf("custom") === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("indeterminate", ctx.to.indeterminate && ctx.formControl.value == null)("formControl", ctx.formControl)("formlyAttributes", ctx.field);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-check-label", ctx.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-label", ctx.to.formCheck.indexOf("custom") === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx.id);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.to.label, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.required && ctx.to.hideRequiredMarker !== true);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgClass"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["CheckboxControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControlDirective"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__["FormlyAttributes"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyFieldCheckbox_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyFieldCheckbox);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldCheckbox, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-checkbox',
                template: `
    <div
      [ngClass]="{
        'form-check': to.formCheck.indexOf('custom') === -1,
        'form-check-inline': to.formCheck === 'inline',
        'custom-control': to.formCheck.indexOf('custom') === 0,
        'custom-checkbox': to.formCheck === 'custom' || to.formCheck === 'custom-inline',
        'custom-control-inline': to.formCheck === 'custom-inline',
        'custom-switch': to.formCheck === 'custom-switch'
      }"
    >
      <input
        type="checkbox"
        [class.is-invalid]="showError"
        [class.form-check-input]="to.formCheck.indexOf('custom') === -1"
        [class.custom-control-input]="to.formCheck.indexOf('custom') === 0"
        [indeterminate]="to.indeterminate && formControl.value == null"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label
        [for]="id"
        [class.form-check-label]="to.formCheck.indexOf('custom') === -1"
        [class.custom-control-label]="to.formCheck.indexOf('custom') === 0"
      >
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
    </div>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/checkbox/src/public_api.ts":
/*!**************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/checkbox/src/public_api.ts ***!
  \**************************************************************************************/
/*! exports provided: FormlyBootstrapCheckboxModule, FormlyFieldCheckbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _checkbox_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./checkbox.module */ "../../src/ui/bootstrap/checkbox/src/checkbox.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapCheckboxModule", function() { return _checkbox_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapCheckboxModule"]; });

/* harmony import */ var _checkbox_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./checkbox.type */ "../../src/ui/bootstrap/checkbox/src/checkbox.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldCheckbox", function() { return _checkbox_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldCheckbox"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/form-field/src/form-field.module.ts":
/*!***********************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/form-field/src/form-field.module.ts ***!
  \***********************************************************************************************/
/*! exports provided: FormlyBootstrapFormFieldModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapFormFieldModule", function() { return FormlyBootstrapFormFieldModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _form_field_wrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./form-field.wrapper */ "../../src/ui/bootstrap/form-field/src/form-field.wrapper.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");







class FormlyBootstrapFormFieldModule {
}
FormlyBootstrapFormFieldModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapFormFieldModule });
FormlyBootstrapFormFieldModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapFormFieldModule_Factory(t) { return new (t || FormlyBootstrapFormFieldModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                wrappers: [
                    {
                        name: 'form-field',
                        component: _form_field_wrapper__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperFormField"],
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapFormFieldModule, { declarations: [_form_field_wrapper__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperFormField"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_5__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapFormFieldModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_form_field_wrapper__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperFormField"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        wrappers: [
                            {
                                name: 'form-field',
                                component: _form_field_wrapper__WEBPACK_IMPORTED_MODULE_4__["FormlyWrapperFormField"],
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/form-field/src/form-field.wrapper.ts":
/*!************************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/form-field/src/form-field.wrapper.ts ***!
  \************************************************************************************************/
/*! exports provided: FormlyWrapperFormField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyWrapperFormField", function() { return FormlyWrapperFormField; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _core_src_lib_templates_formly_validation_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.validation-message */ "../../src/core/src/lib/templates/formly.validation-message.ts");





function FormlyWrapperFormField_label_1_span_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function FormlyWrapperFormField_label_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyWrapperFormField_label_1_span_2_Template, 2, 0, "span", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("for", ctx_r0.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.to.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.to.required && ctx_r0.to.hideRequiredMarker !== true);
} }
function FormlyWrapperFormField_ng_template_2_Template(rf, ctx) { }
function FormlyWrapperFormField_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "formly-validation-message", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("display", "block");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("field", ctx_r3.field);
} }
function FormlyWrapperFormField_small_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r4.to.description);
} }
class FormlyWrapperFormField extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldWrapper"] {
}
FormlyWrapperFormField.ɵfac = function FormlyWrapperFormField_Factory(t) { return ɵFormlyWrapperFormField_BaseFactory(t || FormlyWrapperFormField); };
FormlyWrapperFormField.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyWrapperFormField, selectors: [["formly-wrapper-form-field"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 6, vars: 5, consts: [[1, "form-group"], [4, "ngIf"], ["fieldComponent", ""], ["class", "invalid-feedback", 3, "display", 4, "ngIf"], ["class", "form-text text-muted", 4, "ngIf"], [1, "invalid-feedback"], [3, "field"], [1, "form-text", "text-muted"]], template: function FormlyWrapperFormField_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyWrapperFormField_label_1_Template, 3, 3, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyWrapperFormField_ng_template_2_Template, 0, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormlyWrapperFormField_div_4_Template, 2, 3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FormlyWrapperFormField_small_5_Template, 2, 1, "small", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("has-error", ctx.showError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.label && ctx.to.hideLabel !== true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.description);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _core_src_lib_templates_formly_validation_message__WEBPACK_IMPORTED_MODULE_3__["FormlyValidationMessage"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyWrapperFormField_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyWrapperFormField);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyWrapperFormField, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-wrapper-form-field',
                template: `
    <div class="form-group" [class.has-error]="showError">
      <label *ngIf="to.label && to.hideLabel !== true" [attr.for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>

      <ng-template #fieldComponent></ng-template>

      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
    </div>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/form-field/src/public_api.ts":
/*!****************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/form-field/src/public_api.ts ***!
  \****************************************************************************************/
/*! exports provided: FormlyBootstrapFormFieldModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _form_field_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form-field.module */ "../../src/ui/bootstrap/form-field/src/form-field.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapFormFieldModule", function() { return _form_field_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapFormFieldModule"]; });




/***/ }),

/***/ "../../src/ui/bootstrap/input/src/input.module.ts":
/*!*************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/input/src/input.module.ts ***!
  \*************************************************************************************/
/*! exports provided: FormlyBootstrapInputModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapInputModule", function() { return FormlyBootstrapInputModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _input_type__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./input.type */ "../../src/ui/bootstrap/input/src/input.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");








class FormlyBootstrapInputModule {
}
FormlyBootstrapInputModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapInputModule });
FormlyBootstrapInputModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapInputModule_Factory(t) { return new (t || FormlyBootstrapInputModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'input',
                        component: _input_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldInput"],
                        wrappers: ['form-field'],
                    },
                    { name: 'string', extends: 'input' },
                    {
                        name: 'number',
                        extends: 'input',
                        defaultOptions: {
                            templateOptions: {
                                type: 'number',
                            },
                        },
                    },
                    {
                        name: 'integer',
                        extends: 'input',
                        defaultOptions: {
                            templateOptions: {
                                type: 'number',
                            },
                        },
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapInputModule, { declarations: [_input_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldInput"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapInputModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_input_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldInput"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'input',
                                component: _input_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldInput"],
                                wrappers: ['form-field'],
                            },
                            { name: 'string', extends: 'input' },
                            {
                                name: 'number',
                                extends: 'input',
                                defaultOptions: {
                                    templateOptions: {
                                        type: 'number',
                                    },
                                },
                            },
                            {
                                name: 'integer',
                                extends: 'input',
                                defaultOptions: {
                                    templateOptions: {
                                        type: 'number',
                                    },
                                },
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/input/src/input.type.ts":
/*!***********************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/input/src/input.type.ts ***!
  \***********************************************************************************/
/*! exports provided: FormlyFieldInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldInput", function() { return FormlyFieldInput; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");






function FormlyFieldInput_input_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "input", 2);
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("is-invalid", ctx_r0.showError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", ctx_r0.type)("formControl", ctx_r0.formControl)("formlyAttributes", ctx_r0.field);
} }
function FormlyFieldInput_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "input", 3);
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("is-invalid", ctx_r2.showError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx_r2.formControl)("formlyAttributes", ctx_r2.field);
} }
class FormlyFieldInput extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldType"] {
    get type() {
        return this.to.type || 'text';
    }
}
FormlyFieldInput.ɵfac = function FormlyFieldInput_Factory(t) { return ɵFormlyFieldInput_BaseFactory(t || FormlyFieldInput); };
FormlyFieldInput.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldInput, selectors: [["formly-field-input"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 3, vars: 2, consts: [["class", "form-control", 3, "type", "formControl", "formlyAttributes", "is-invalid", 4, "ngIf", "ngIfElse"], ["numberTmp", ""], [1, "form-control", 3, "type", "formControl", "formlyAttributes"], ["type", "number", 1, "form-control", 3, "formControl", "formlyAttributes"]], template: function FormlyFieldInput_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormlyFieldInput_input_0_Template, 1, 5, "input", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldInput_ng_template_1_Template, 1, 4, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type !== "number")("ngIfElse", _r1);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControlDirective"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__["FormlyAttributes"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NumberValueAccessor"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyFieldInput_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyFieldInput);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldInput, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-input',
                template: `
    <input
      *ngIf="type !== 'number'; else numberTmp"
      [type]="type"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
    />
    <ng-template #numberTmp>
      <input
        type="number"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
      />
    </ng-template>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/input/src/public_api.ts":
/*!***********************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/input/src/public_api.ts ***!
  \***********************************************************************************/
/*! exports provided: FormlyBootstrapInputModule, FormlyFieldInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _input_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./input.module */ "../../src/ui/bootstrap/input/src/input.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapInputModule", function() { return _input_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapInputModule"]; });

/* harmony import */ var _input_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./input.type */ "../../src/ui/bootstrap/input/src/input.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldInput", function() { return _input_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldInput"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/multicheckbox/src/multicheckbox.module.ts":
/*!*****************************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/multicheckbox/src/multicheckbox.module.ts ***!
  \*****************************************************************************************************/
/*! exports provided: FormlyBootstrapMultiCheckboxModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapMultiCheckboxModule", function() { return FormlyBootstrapMultiCheckboxModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/core/select */ "../../src/core/select/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _multicheckbox_type__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./multicheckbox.type */ "../../src/ui/bootstrap/multicheckbox/src/multicheckbox.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");









class FormlyBootstrapMultiCheckboxModule {
}
FormlyBootstrapMultiCheckboxModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapMultiCheckboxModule });
FormlyBootstrapMultiCheckboxModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapMultiCheckboxModule_Factory(t) { return new (t || FormlyBootstrapMultiCheckboxModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'multicheckbox',
                        component: _multicheckbox_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldMultiCheckbox"],
                        wrappers: ['form-field'],
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapMultiCheckboxModule, { declarations: [_multicheckbox_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldMultiCheckbox"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
        _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapMultiCheckboxModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_multicheckbox_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldMultiCheckbox"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'multicheckbox',
                                component: _multicheckbox_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldMultiCheckbox"],
                                wrappers: ['form-field'],
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/multicheckbox/src/multicheckbox.type.ts":
/*!***************************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/multicheckbox/src/multicheckbox.type.ts ***!
  \***************************************************************************************************/
/*! exports provided: FormlyFieldMultiCheckbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldMultiCheckbox", function() { return FormlyFieldMultiCheckbox; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");
/* harmony import */ var _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/select/src/select-options.pipe */ "../../src/core/select/src/select-options.pipe.ts");






const _c0 = function (a0, a1, a2, a3, a4, a5) { return { "form-check": a0, "form-check-inline": a1, "custom-control": a2, "custom-checkbox": a3, "custom-control-inline": a4, "custom-switch": a5 }; };
function FormlyFieldMultiCheckbox_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "input", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function FormlyFieldMultiCheckbox_div_1_Template_input_change_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const option_r1 = ctx.$implicit; const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r3.onChange(option_r1.value, $event.target.checked); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "label", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction6"](15, _c0, ctx_r0.to.formCheck.indexOf("custom") === 0 - 1, ctx_r0.to.formCheck === "inline", ctx_r0.to.formCheck.indexOf("custom") === 0, ctx_r0.to.formCheck === "custom" || ctx_r0.to.formCheck === "custom-inline", ctx_r0.to.formCheck === "custom-inline", ctx_r0.to.formCheck === "custom-switch"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-check-input", ctx_r0.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-input", ctx_r0.to.formCheck.indexOf("custom") === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx_r0.id + "_" + i_r2)("value", option_r1.value)("checked", ctx_r0.isChecked(option_r1))("formlyAttributes", ctx_r0.field);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-check-label", ctx_r0.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-label", ctx_r0.to.formCheck.indexOf("custom") === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx_r0.id + "_" + i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", option_r1.label, " ");
} }
class FormlyFieldMultiCheckbox extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldType"] {
    constructor() {
        super(...arguments);
        this.defaultOptions = {
            templateOptions: {
                options: [],
                formCheck: 'custom',
            },
        };
    }
    onChange(value, checked) {
        if (this.to.type === 'array') {
            this.formControl.patchValue(checked
                ? [...(this.formControl.value || []), value]
                : [...(this.formControl.value || [])].filter((o) => o !== value));
        }
        else {
            this.formControl.patchValue(Object.assign(Object.assign({}, this.formControl.value), { [value]: checked }));
        }
        this.formControl.markAsTouched();
    }
    isChecked(option) {
        const value = this.formControl.value;
        return value && (this.to.type === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
    }
}
FormlyFieldMultiCheckbox.ɵfac = function FormlyFieldMultiCheckbox_Factory(t) { return ɵFormlyFieldMultiCheckbox_BaseFactory(t || FormlyFieldMultiCheckbox); };
FormlyFieldMultiCheckbox.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldMultiCheckbox, selectors: [["formly-field-multicheckbox"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 4, vars: 6, consts: [[3, "ngClass", 4, "ngFor", "ngForOf"], [3, "ngClass"], ["type", "checkbox", 3, "id", "value", "checked", "formlyAttributes", "change"], [3, "for"]], template: function FormlyFieldMultiCheckbox_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldMultiCheckbox_div_1_Template, 4, 22, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "formlySelectOptions");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](3, 3, ctx.to.options, ctx.field)));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgClass"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_3__["FormlyAttributes"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["AsyncPipe"], _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_4__["FormlySelectOptionsPipe"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyFieldMultiCheckbox_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyFieldMultiCheckbox);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldMultiCheckbox, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-multicheckbox',
                template: `
    <div>
      <div
        *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
        [ngClass]="{
          'form-check': to.formCheck.indexOf('custom') === -1,
          'form-check-inline': to.formCheck === 'inline',
          'custom-control': to.formCheck.indexOf('custom') === 0,
          'custom-checkbox': to.formCheck === 'custom' || to.formCheck === 'custom-inline',
          'custom-control-inline': to.formCheck === 'custom-inline',
          'custom-switch': to.formCheck === 'custom-switch'
        }"
      >
        <input
          type="checkbox"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-input]="to.formCheck.indexOf('custom') === 0"
          [value]="option.value"
          [checked]="isChecked(option)"
          [formlyAttributes]="field"
          (change)="onChange(option.value, $event.target.checked)"
        />
        <label
          [class.form-check-label]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-label]="to.formCheck.indexOf('custom') === 0"
          [for]="id + '_' + i"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/multicheckbox/src/public_api.ts":
/*!*******************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/multicheckbox/src/public_api.ts ***!
  \*******************************************************************************************/
/*! exports provided: FormlyBootstrapMultiCheckboxModule, FormlyFieldMultiCheckbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _multicheckbox_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./multicheckbox.module */ "../../src/ui/bootstrap/multicheckbox/src/multicheckbox.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapMultiCheckboxModule", function() { return _multicheckbox_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapMultiCheckboxModule"]; });

/* harmony import */ var _multicheckbox_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./multicheckbox.type */ "../../src/ui/bootstrap/multicheckbox/src/multicheckbox.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldMultiCheckbox", function() { return _multicheckbox_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldMultiCheckbox"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/radio/src/public_api.ts":
/*!***********************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/radio/src/public_api.ts ***!
  \***********************************************************************************/
/*! exports provided: FormlyBootstrapRadioModule, FormlyFieldRadio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _radio_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./radio.module */ "../../src/ui/bootstrap/radio/src/radio.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapRadioModule", function() { return _radio_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapRadioModule"]; });

/* harmony import */ var _radio_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./radio.type */ "../../src/ui/bootstrap/radio/src/radio.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldRadio", function() { return _radio_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldRadio"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/radio/src/radio.module.ts":
/*!*************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/radio/src/radio.module.ts ***!
  \*************************************************************************************/
/*! exports provided: FormlyBootstrapRadioModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapRadioModule", function() { return FormlyBootstrapRadioModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/core/select */ "../../src/core/select/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _radio_type__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./radio.type */ "../../src/ui/bootstrap/radio/src/radio.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");









class FormlyBootstrapRadioModule {
}
FormlyBootstrapRadioModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapRadioModule });
FormlyBootstrapRadioModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapRadioModule_Factory(t) { return new (t || FormlyBootstrapRadioModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'radio',
                        component: _radio_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldRadio"],
                        wrappers: ['form-field'],
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapRadioModule, { declarations: [_radio_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldRadio"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
        _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapRadioModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_radio_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldRadio"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'radio',
                                component: _radio_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldRadio"],
                                wrappers: ['form-field'],
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/radio/src/radio.type.ts":
/*!***********************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/radio/src/radio.type.ts ***!
  \***********************************************************************************/
/*! exports provided: FormlyFieldRadio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldRadio", function() { return FormlyFieldRadio; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");
/* harmony import */ var _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/select/src/select-options.pipe */ "../../src/core/select/src/select-options.pipe.ts");







const _c0 = function (a0, a1, a2, a3) { return { "form-check": a0, "form-check-inline": a1, "custom-control custom-radio": a2, "custom-control-inline": a3 }; };
function FormlyFieldRadio_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "input", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "label", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction4"](19, _c0, ctx_r0.to.formCheck.indexOf("custom") === 0 - 1, ctx_r0.to.formCheck === "inline", ctx_r0.to.formCheck.indexOf("custom") === 0, ctx_r0.to.formCheck === "custom-inline"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-check-input", ctx_r0.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-input", ctx_r0.to.formCheck.indexOf("custom") === 0)("is-invalid", ctx_r0.showError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx_r0.id + "_" + i_r2)("name", ctx_r0.field.name || ctx_r0.id)("value", option_r1.value)("formControl", ctx_r0.formControl)("formlyAttributes", ctx_r0.field);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("value", option_r1.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-check-label", ctx_r0.to.formCheck.indexOf("custom") === 0 - 1)("custom-control-label", ctx_r0.to.formCheck.indexOf("custom") === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx_r0.id + "_" + i_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", option_r1.label, " ");
} }
class FormlyFieldRadio extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldType"] {
    constructor() {
        super(...arguments);
        this.defaultOptions = {
            templateOptions: {
                options: [],
                formCheck: 'custom',
            },
        };
    }
}
FormlyFieldRadio.ɵfac = function FormlyFieldRadio_Factory(t) { return ɵFormlyFieldRadio_BaseFactory(t || FormlyFieldRadio); };
FormlyFieldRadio.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldRadio, selectors: [["formly-field-radio"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 4, vars: 6, consts: [[3, "ngClass", 4, "ngFor", "ngForOf"], [3, "ngClass"], ["type", "radio", 3, "id", "name", "value", "formControl", "formlyAttributes"], [3, "for"]], template: function FormlyFieldRadio_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldRadio_div_1_Template, 4, 24, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "formlySelectOptions");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](3, 3, ctx.to.options, ctx.field)));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgClass"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["RadioControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControlDirective"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_4__["FormlyAttributes"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["AsyncPipe"], _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_5__["FormlySelectOptionsPipe"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyFieldRadio_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyFieldRadio);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldRadio, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-radio',
                template: `
    <div>
      <div
        *ngFor="let option of to.options | formlySelectOptions: field | async; let i = index"
        [ngClass]="{
          'form-check': to.formCheck.indexOf('custom') === -1,
          'form-check-inline': to.formCheck === 'inline',
          'custom-control custom-radio': to.formCheck.indexOf('custom') === 0,
          'custom-control-inline': to.formCheck === 'custom-inline'
        }"
      >
        <input
          type="radio"
          [id]="id + '_' + i"
          [class.form-check-input]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-input]="to.formCheck.indexOf('custom') === 0"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="formControl"
          [formlyAttributes]="field"
        />
        <label
          [class.form-check-label]="to.formCheck.indexOf('custom') === -1"
          [class.custom-control-label]="to.formCheck.indexOf('custom') === 0"
          [for]="id + '_' + i"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/select/src/public_api.ts":
/*!************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/select/src/public_api.ts ***!
  \************************************************************************************/
/*! exports provided: FormlyBootstrapSelectModule, FormlyFieldSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _select_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./select.module */ "../../src/ui/bootstrap/select/src/select.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapSelectModule", function() { return _select_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapSelectModule"]; });

/* harmony import */ var _select_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./select.type */ "../../src/ui/bootstrap/select/src/select.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldSelect", function() { return _select_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldSelect"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/select/src/select.module.ts":
/*!***************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/select/src/select.module.ts ***!
  \***************************************************************************************/
/*! exports provided: FormlyBootstrapSelectModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapSelectModule", function() { return FormlyBootstrapSelectModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/core/select */ "../../src/core/select/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _select_type__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./select.type */ "../../src/ui/bootstrap/select/src/select.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");









class FormlyBootstrapSelectModule {
}
FormlyBootstrapSelectModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapSelectModule });
FormlyBootstrapSelectModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapSelectModule_Factory(t) { return new (t || FormlyBootstrapSelectModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'select',
                        component: _select_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldSelect"],
                        wrappers: ['form-field'],
                    },
                    { name: 'enum', extends: 'select' },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapSelectModule, { declarations: [_select_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldSelect"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
        _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_7__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapSelectModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_select_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldSelect"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core_select__WEBPACK_IMPORTED_MODULE_4__["FormlySelectModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_3__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'select',
                                component: _select_type__WEBPACK_IMPORTED_MODULE_6__["FormlyFieldSelect"],
                                wrappers: ['form-field'],
                            },
                            { name: 'enum', extends: 'select' },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/select/src/select.type.ts":
/*!*************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/select/src/select.type.ts ***!
  \*************************************************************************************/
/*! exports provided: FormlyFieldSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldSelect", function() { return FormlyFieldSelect; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");
/* harmony import */ var _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/select/src/select-options.pipe */ "../../src/core/select/src/select-options.pipe.ts");









function FormlyFieldSelect_select_0_ng_container_1_ng_container_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opt_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", opt_r9.value)("disabled", opt_r9.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](opt_r9.label);
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_select_0_ng_container_1_ng_container_1_ng_container_1_Template, 3, 3, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opts_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opts_r4);
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_option_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const opt_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", opt_r12.value)("disabled", opt_r12.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](opt_r12.label);
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_ng_template_2_option_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const child_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", child_r18.value)("disabled", child_r18.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", child_r18.label, " ");
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "optgroup", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_ng_template_2_option_1_Template, 2, 3, "option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const opt_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("label", opt_r12.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opt_r12.group);
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_option_1_Template, 2, 3, "option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_ng_template_2_Template, 2, 2, "ng-template", null, 9, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opt_r12 = ctx.$implicit;
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !opt_r12.group)("ngIfElse", _r14);
} }
function FormlyFieldSelect_select_0_ng_container_1_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormlyFieldSelect_select_0_ng_container_1_ng_template_2_ng_container_0_Template, 4, 2, "ng-container", 6);
} if (rf & 2) {
    const opts_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opts_r4);
} }
function FormlyFieldSelect_select_0_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_select_0_ng_container_1_ng_container_1_Template, 2, 1, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyFieldSelect_select_0_ng_container_1_ng_template_2_Template, 1, 1, "ng-template", null, 5, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r3.to._flatOptions)("ngIfElse", _r6);
} }
function FormlyFieldSelect_select_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "select", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_select_0_ng_container_1_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "formlySelectOptions");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("custom-select", ctx_r0.to.customSelect)("is-invalid", ctx_r0.showError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx_r0.formControl)("compareWith", ctx_r0.to.compareWith)("formlyAttributes", ctx_r0.field);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 8, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](3, 10, ctx_r0.to.options, ctx_r0.field)));
} }
function FormlyFieldSelect_ng_template_1_option_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r21.to.placeholder);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_container_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opt_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", opt_r28.value)("disabled", opt_r28.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](opt_r28.label);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_ng_container_2_ng_container_1_ng_container_1_Template, 3, 3, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opts_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opts_r23);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_option_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const opt_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", opt_r31.value)("disabled", opt_r31.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](opt_r31.label);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_ng_template_2_option_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const child_r37 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", child_r37.value)("disabled", child_r37.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", child_r37.label, " ");
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "optgroup", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_ng_template_2_option_1_Template, 2, 3, "option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const opt_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("label", opt_r31.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opt_r31.group);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_option_1_Template, 2, 3, "option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_ng_template_2_Template, 2, 2, "ng-template", null, 9, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const opt_r31 = ctx.$implicit;
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !opt_r31.group)("ngIfElse", _r33);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_ng_container_0_Template, 4, 2, "ng-container", 6);
} if (rf & 2) {
    const opts_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", opts_r23);
} }
function FormlyFieldSelect_ng_template_1_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_ng_container_2_ng_container_1_Template, 2, 1, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyFieldSelect_ng_template_1_ng_container_2_ng_template_2_Template, 1, 1, "ng-template", null, 5, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r22.to._flatOptions)("ngIfElse", _r25);
} }
function FormlyFieldSelect_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "select", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_option_1_Template, 2, 2, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormlyFieldSelect_ng_template_1_ng_container_2_Template, 4, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "formlySelectOptions");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("custom-select", ctx_r2.to.customSelect)("is-invalid", ctx_r2.showError);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx_r2.formControl)("compareWith", ctx_r2.to.compareWith)("formlyAttributes", ctx_r2.field);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.to.placeholder);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 9, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](4, 11, ctx_r2.to.options, ctx_r2.field)));
} }
class FormlyFieldSelect extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FieldType"] {
    constructor(ngZone) {
        super();
        this.ngZone = ngZone;
        this.defaultOptions = {
            templateOptions: {
                options: [],
                compareWith(o1, o2) {
                    return o1 === o2;
                },
            },
        };
    }
    // workaround for https://github.com/angular/angular/issues/10010
    set selectAccessor(s) {
        if (!s) {
            return;
        }
        const writeValue = s.writeValue.bind(s);
        if (s._getOptionId(s.value) === null) {
            writeValue(s.value);
        }
        s.writeValue = (value) => {
            const id = s._idCounter;
            writeValue(value);
            if (value === null) {
                this.ngZone.onStable
                    .asObservable()
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1))
                    .subscribe(() => {
                    if (id !== s._idCounter &&
                        s._getOptionId(value) === null &&
                        s._elementRef.nativeElement.selectedIndex !== -1) {
                        writeValue(value);
                    }
                });
            }
        };
    }
}
FormlyFieldSelect.ɵfac = function FormlyFieldSelect_Factory(t) { return new (t || FormlyFieldSelect)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"])); };
FormlyFieldSelect.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldSelect, selectors: [["formly-field-select"]], viewQuery: function FormlyFieldSelect_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["SelectControlValueAccessor"], true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.selectAccessor = _t.first);
    } }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 3, vars: 2, consts: [["class", "form-control", "multiple", "", 3, "custom-select", "formControl", "compareWith", "is-invalid", "formlyAttributes", 4, "ngIf", "ngIfElse"], ["singleSelect", ""], ["multiple", "", 1, "form-control", 3, "formControl", "compareWith", "formlyAttributes"], [4, "ngIf"], [4, "ngIf", "ngIfElse"], ["grouplist", ""], [4, "ngFor", "ngForOf"], [3, "ngValue", "disabled"], [3, "ngValue", "disabled", 4, "ngIf", "ngIfElse"], ["optgroup", ""], [3, "label"], [3, "ngValue", "disabled", 4, "ngFor", "ngForOf"], [1, "form-control", 3, "formControl", "compareWith", "formlyAttributes"], [3, "ngValue", 4, "ngIf"], [3, "ngValue"]], template: function FormlyFieldSelect_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormlyFieldSelect_select_0_Template, 4, 13, "select", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormlyFieldSelect_ng_template_1_Template, 5, 14, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.to.multiple)("ngIfElse", _r1);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["SelectMultipleControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_5__["FormlyAttributes"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_x"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["SelectControlValueAccessor"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["AsyncPipe"], _core_select_src_select_options_pipe__WEBPACK_IMPORTED_MODULE_6__["FormlySelectOptionsPipe"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldSelect, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-select',
                template: `
    <select
      *ngIf="to.multiple; else singleSelect"
      class="form-control"
      multiple
      [class.custom-select]="to.customSelect"
      [formControl]="formControl"
      [compareWith]="to.compareWith"
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
    >
      <ng-container *ngIf="to.options | formlySelectOptions: field | async as opts">
        <ng-container *ngIf="to._flatOptions; else grouplist">
          <ng-container *ngFor="let opt of opts">
            <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
          </ng-container>
        </ng-container>

        <ng-template #grouplist>
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">{{
              opt.label
            }}</option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-template>
      </ng-container>
    </select>

    <ng-template #singleSelect>
      <select
        class="form-control"
        [formControl]="formControl"
        [compareWith]="to.compareWith"
        [class.custom-select]="to.customSelect"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
      >
        <option *ngIf="to.placeholder" [ngValue]="undefined">{{ to.placeholder }}</option>
        <ng-container *ngIf="to.options | formlySelectOptions: field | async as opts">
          <ng-container *ngIf="to._flatOptions; else grouplist">
            <ng-container *ngFor="let opt of opts">
              <option [ngValue]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
            </ng-container>
          </ng-container>

          <ng-template #grouplist>
            <ng-container *ngFor="let opt of opts">
              <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">{{
                opt.label
              }}</option>
              <ng-template #optgroup>
                <optgroup [label]="opt.label">
                  <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                    {{ child.label }}
                  </option>
                </optgroup>
              </ng-template>
            </ng-container>
          </ng-template>
        </ng-container>
      </select>
    </ng-template>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }]; }, { selectAccessor: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["SelectControlValueAccessor"]]
        }] }); })();


/***/ }),

/***/ "../../src/ui/bootstrap/src/lib/bootstrap.module.ts":
/*!***************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/src/lib/bootstrap.module.ts ***!
  \***************************************************************************************/
/*! exports provided: FormlyBootstrapModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapModule", function() { return FormlyBootstrapModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/bootstrap/input */ "../../src/ui/bootstrap/input/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_textarea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-formly/bootstrap/textarea */ "../../src/ui/bootstrap/textarea/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_radio__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/bootstrap/radio */ "../../src/ui/bootstrap/radio/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_checkbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-formly/bootstrap/checkbox */ "../../src/ui/bootstrap/checkbox/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_multicheckbox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-formly/bootstrap/multicheckbox */ "../../src/ui/bootstrap/multicheckbox/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngx-formly/bootstrap/select */ "../../src/ui/bootstrap/select/src/public_api.ts");
/* harmony import */ var _ngx_formly_bootstrap_addons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-formly/bootstrap/addons */ "../../src/ui/bootstrap/addons/src/public_api.ts");










class FormlyBootstrapModule {
}
FormlyBootstrapModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapModule });
FormlyBootstrapModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapModule_Factory(t) { return new (t || FormlyBootstrapModule)(); }, imports: [[
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_1__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_bootstrap_input__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapInputModule"],
            _ngx_formly_bootstrap_textarea__WEBPACK_IMPORTED_MODULE_3__["FormlyBootstrapTextAreaModule"],
            _ngx_formly_bootstrap_radio__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapRadioModule"],
            _ngx_formly_bootstrap_checkbox__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapCheckboxModule"],
            _ngx_formly_bootstrap_multicheckbox__WEBPACK_IMPORTED_MODULE_6__["FormlyBootstrapMultiCheckboxModule"],
            _ngx_formly_bootstrap_select__WEBPACK_IMPORTED_MODULE_7__["FormlyBootstrapSelectModule"],
            _ngx_formly_bootstrap_addons__WEBPACK_IMPORTED_MODULE_8__["FormlyBootstrapAddonsModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapModule, { imports: [_ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_1__["FormlyBootstrapFormFieldModule"],
        _ngx_formly_bootstrap_input__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapInputModule"],
        _ngx_formly_bootstrap_textarea__WEBPACK_IMPORTED_MODULE_3__["FormlyBootstrapTextAreaModule"],
        _ngx_formly_bootstrap_radio__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapRadioModule"],
        _ngx_formly_bootstrap_checkbox__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapCheckboxModule"],
        _ngx_formly_bootstrap_multicheckbox__WEBPACK_IMPORTED_MODULE_6__["FormlyBootstrapMultiCheckboxModule"],
        _ngx_formly_bootstrap_select__WEBPACK_IMPORTED_MODULE_7__["FormlyBootstrapSelectModule"],
        _ngx_formly_bootstrap_addons__WEBPACK_IMPORTED_MODULE_8__["FormlyBootstrapAddonsModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_1__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_bootstrap_input__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapInputModule"],
                    _ngx_formly_bootstrap_textarea__WEBPACK_IMPORTED_MODULE_3__["FormlyBootstrapTextAreaModule"],
                    _ngx_formly_bootstrap_radio__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapRadioModule"],
                    _ngx_formly_bootstrap_checkbox__WEBPACK_IMPORTED_MODULE_5__["FormlyBootstrapCheckboxModule"],
                    _ngx_formly_bootstrap_multicheckbox__WEBPACK_IMPORTED_MODULE_6__["FormlyBootstrapMultiCheckboxModule"],
                    _ngx_formly_bootstrap_select__WEBPACK_IMPORTED_MODULE_7__["FormlyBootstrapSelectModule"],
                    _ngx_formly_bootstrap_addons__WEBPACK_IMPORTED_MODULE_8__["FormlyBootstrapAddonsModule"],
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/src/lib/bootstrap.ts":
/*!********************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/src/lib/bootstrap.ts ***!
  \********************************************************************************/
/*! exports provided: FormlyBootstrapModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap.module */ "../../src/ui/bootstrap/src/lib/bootstrap.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapModule", function() { return _bootstrap_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapModule"]; });




/***/ }),

/***/ "../../src/ui/bootstrap/src/public_api.ts":
/*!*****************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/src/public_api.ts ***!
  \*****************************************************************************/
/*! exports provided: FormlyBootstrapModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/bootstrap */ "../../src/ui/bootstrap/src/lib/bootstrap.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapModule", function() { return _lib_bootstrap__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapModule"]; });

/*
 * Public API Surface of bootstrap
 */



/***/ }),

/***/ "../../src/ui/bootstrap/textarea/src/public_api.ts":
/*!**************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/textarea/src/public_api.ts ***!
  \**************************************************************************************/
/*! exports provided: FormlyBootstrapTextAreaModule, FormlyFieldTextArea */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _textarea_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./textarea.module */ "../../src/ui/bootstrap/textarea/src/textarea.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapTextAreaModule", function() { return _textarea_module__WEBPACK_IMPORTED_MODULE_0__["FormlyBootstrapTextAreaModule"]; });

/* harmony import */ var _textarea_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./textarea.type */ "../../src/ui/bootstrap/textarea/src/textarea.type.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldTextArea", function() { return _textarea_type__WEBPACK_IMPORTED_MODULE_1__["FormlyFieldTextArea"]; });





/***/ }),

/***/ "../../src/ui/bootstrap/textarea/src/textarea.module.ts":
/*!*******************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/textarea/src/textarea.module.ts ***!
  \*******************************************************************************************/
/*! exports provided: FormlyBootstrapTextAreaModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyBootstrapTextAreaModule", function() { return FormlyBootstrapTextAreaModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-formly/bootstrap/form-field */ "../../src/ui/bootstrap/form-field/src/public_api.ts");
/* harmony import */ var _textarea_type__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./textarea.type */ "../../src/ui/bootstrap/textarea/src/textarea.type.ts");
/* harmony import */ var _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/src/lib/core.module */ "../../src/core/src/lib/core.module.ts");








class FormlyBootstrapTextAreaModule {
}
FormlyBootstrapTextAreaModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FormlyBootstrapTextAreaModule });
FormlyBootstrapTextAreaModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FormlyBootstrapTextAreaModule_Factory(t) { return new (t || FormlyBootstrapTextAreaModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
            _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
            _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                types: [
                    {
                        name: 'textarea',
                        component: _textarea_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldTextArea"],
                        wrappers: ['form-field'],
                    },
                ],
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FormlyBootstrapTextAreaModule, { declarations: [_textarea_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldTextArea"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
        _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"], _core_src_lib_core_module__WEBPACK_IMPORTED_MODULE_6__["FormlyModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyBootstrapTextAreaModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_textarea_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldTextArea"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                    _ngx_formly_bootstrap_form_field__WEBPACK_IMPORTED_MODULE_4__["FormlyBootstrapFormFieldModule"],
                    _ngx_formly_core__WEBPACK_IMPORTED_MODULE_2__["FormlyModule"].forChild({
                        types: [
                            {
                                name: 'textarea',
                                component: _textarea_type__WEBPACK_IMPORTED_MODULE_5__["FormlyFieldTextArea"],
                                wrappers: ['form-field'],
                            },
                        ],
                    }),
                ],
            }]
    }], null, null); })();


/***/ }),

/***/ "../../src/ui/bootstrap/textarea/src/textarea.type.ts":
/*!*****************************************************************************************!*\
  !*** /home/abdel/www/project/formly/lib/src/ui/bootstrap/textarea/src/textarea.type.ts ***!
  \*****************************************************************************************/
/*! exports provided: FormlyFieldTextArea */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormlyFieldTextArea", function() { return FormlyFieldTextArea; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-formly/core */ "../../src/core/src/public_api.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/src/lib/templates/formly.attributes */ "../../src/core/src/lib/templates/formly.attributes.ts");





class FormlyFieldTextArea extends _ngx_formly_core__WEBPACK_IMPORTED_MODULE_1__["FieldType"] {
    constructor() {
        super(...arguments);
        this.defaultOptions = {
            templateOptions: {
                cols: 1,
                rows: 1,
            },
        };
    }
}
FormlyFieldTextArea.ɵfac = function FormlyFieldTextArea_Factory(t) { return ɵFormlyFieldTextArea_BaseFactory(t || FormlyFieldTextArea); };
FormlyFieldTextArea.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormlyFieldTextArea, selectors: [["formly-field-textarea"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]], decls: 2, vars: 6, consts: [[1, "form-control", 3, "formControl", "cols", "rows", "formlyAttributes"]], template: function FormlyFieldTextArea_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "textarea", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "    ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("is-invalid", ctx.showError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.formControl)("cols", ctx.to.cols)("rows", ctx.to.rows)("formlyAttributes", ctx.field);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControlDirective"], _core_src_lib_templates_formly_attributes__WEBPACK_IMPORTED_MODULE_3__["FormlyAttributes"]], encapsulation: 2, changeDetection: 0 });
const ɵFormlyFieldTextArea_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](FormlyFieldTextArea);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormlyFieldTextArea, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formly-field-textarea',
                template: `
    <textarea
      [formControl]="formControl"
      [cols]="to.cols"
      [rows]="to.rows"
      class="form-control"
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
    >
    </textarea>
  `,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/ui/bootstrap.module.ts":
/*!****************************************!*\
  !*** ./src/app/ui/bootstrap.module.ts ***!
  \****************************************/
/*! exports provided: UIBootstrapModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIBootstrapModule", function() { return UIBootstrapModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _ngx_formly_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-formly/bootstrap */ "../../src/ui/bootstrap/src/public_api.ts");
/* harmony import */ var _ui_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui.module */ "./src/app/ui/ui.module.ts");
/* harmony import */ var _ui_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui.component */ "./src/app/ui/ui.component.ts");







class UIBootstrapModule {
}
UIBootstrapModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: UIBootstrapModule });
UIBootstrapModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function UIBootstrapModule_Factory(t) { return new (t || UIBootstrapModule)(); }, providers: [], imports: [[
            _ui_module__WEBPACK_IMPORTED_MODULE_3__["UIModule"],
            _ngx_formly_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild([
                {
                    path: '',
                    component: _ui_component__WEBPACK_IMPORTED_MODULE_4__["UIComponent"],
                },
            ]),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](UIBootstrapModule, { imports: [_ui_module__WEBPACK_IMPORTED_MODULE_3__["UIModule"],
        _ngx_formly_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapModule"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](UIBootstrapModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _ui_module__WEBPACK_IMPORTED_MODULE_3__["UIModule"],
                    _ngx_formly_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormlyBootstrapModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild([
                        {
                            path: '',
                            component: _ui_component__WEBPACK_IMPORTED_MODULE_4__["UIComponent"],
                        },
                    ]),
                ],
                providers: [],
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=ui-bootstrap-module.js.map