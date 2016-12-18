# Change Log

# Breaking Change
`ng2-formly` has been renamed to `ng-formly`. The current version is RC.0 🔥🔥🔥

## [Unreleased](https://github.com/formly-js/ng-formly/tree/HEAD)

[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.14...HEAD)

**Implemented enhancements:**

- Asynchronous resolution of validation messages [\#334](https://github.com/formly-js/ng-formly/issues/334)
- Arrays in Property Keys [\#333](https://github.com/formly-js/ng-formly/issues/333)
- \[field\] allow providing custom formControl through field config [\#325](https://github.com/formly-js/ng-formly/issues/325)
- \[BC\]\[wrapper\] wrappers are rendered in the reverse order compared to angular-formly [\#322](https://github.com/formly-js/ng-formly/issues/322)
- Field.validation.messages [\#307](https://github.com/formly-js/ng-formly/issues/307)

**Closed issues:**

- resetModel broken with FormArrays [\#350](https://github.com/formly-js/ng-formly/issues/350)
- Repeat Section \[Validation not being applied to investmentDate\] [\#349](https://github.com/formly-js/ng-formly/issues/349)
- model / fields circular references [\#346](https://github.com/formly-js/ng-formly/issues/346)
- repeatSection / fieldArray does not emit form valueChanges [\#344](https://github.com/formly-js/ng-formly/issues/344)
- Validators Expression not triggered for Checkboxes [\#337](https://github.com/formly-js/ng-formly/issues/337)
- ng2-select with formly [\#332](https://github.com/formly-js/ng-formly/issues/332)
- \[buildForm\] should be called only once [\#330](https://github.com/formly-js/ng-formly/issues/330)
- Using callback function to reset field model when hidden [\#328](https://github.com/formly-js/ng-formly/issues/328)
- Parameter 'x' implicitly has an 'any' type after adding ng2-formly modules [\#323](https://github.com/formly-js/ng-formly/issues/323)
- \[BC\]\[field-config\] angular-formly use `wrapper` rather than `wrappers` [\#321](https://github.com/formly-js/ng-formly/issues/321)
- \[Validation\] Hidden fields should be marked as valid [\#318](https://github.com/formly-js/ng-formly/issues/318)
- FieldExpression does not applied to field with FieldGroup [\#317](https://github.com/formly-js/ng-formly/issues/317)
- Expression properties error [\#270](https://github.com/formly-js/ng-formly/issues/270)

**Merged pull requests:**

- fix\(RepeatComponent\): fixed resetModel with FormArrays [\#354](https://github.com/formly-js/ng-formly/pull/354) ([aitboudad](https://github.com/aitboudad))
- fix\(date-validation\): allow empty value. [\#352](https://github.com/formly-js/ng-formly/pull/352) ([aitboudad](https://github.com/aitboudad))
- fix\(validation\): merge field default options before init validation. [\#351](https://github.com/formly-js/ng-formly/pull/351) ([aitboudad](https://github.com/aitboudad))
- fix\(resetModel\): update options.resetModel to reset FormArrays correctly [\#348](https://github.com/formly-js/ng-formly/pull/348) ([franzeal](https://github.com/franzeal))
- fix\(\#346\): fixed repeatSection model [\#347](https://github.com/formly-js/ng-formly/pull/347) ([aitboudad](https://github.com/aitboudad))
- fix\(\#344\): \[fieldArray\] emit form valueChanges [\#345](https://github.com/formly-js/ng-formly/pull/345) ([aitboudad](https://github.com/aitboudad))
- fix\(Array\) Array in property access [\#343](https://github.com/formly-js/ng-formly/pull/343) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(\#330\): ensure buildForm is called only once per form [\#342](https://github.com/formly-js/ng-formly/pull/342) ([aitboudad](https://github.com/aitboudad))
- fix\(wrapper\): add field key to warn [\#341](https://github.com/formly-js/ng-formly/pull/341) ([aitboudad](https://github.com/aitboudad))
- fix\(Validation\): Hidden fields should be marked as valid [\#340](https://github.com/formly-js/ng-formly/pull/340) ([aitboudad](https://github.com/aitboudad))
- fix\(Validation\) make show optional [\#339](https://github.com/formly-js/ng-formly/pull/339) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Validation\) supporting field.validation.messages [\#338](https://github.com/formly-js/ng-formly/pull/338) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(wrapper\) deprecate wrapper [\#336](https://github.com/formly-js/ng-formly/pull/336) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(form-build\): inject missing options arg. [\#331](https://github.com/formly-js/ng-formly/pull/331) ([aitboudad](https://github.com/aitboudad))
- feat\(field\): attach created FormControls to field [\#329](https://github.com/formly-js/ng-formly/pull/329) ([aitboudad](https://github.com/aitboudad))
- fix\(implicitAny\) fixing implicitAny error [\#327](https://github.com/formly-js/ng-formly/pull/327) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(field\): allow providing custom formControl through field config [\#326](https://github.com/formly-js/ng-formly/pull/326) ([aitboudad](https://github.com/aitboudad))
- feat\(field\): add hide option [\#324](https://github.com/formly-js/ng-formly/pull/324) ([aitboudad](https://github.com/aitboudad))
- \[270\] execute field expression during form build [\#320](https://github.com/formly-js/ng-formly/pull/320) ([aitboudad](https://github.com/aitboudad))
- fix\(FieldExpression\): init field expression for all fields [\#319](https://github.com/formly-js/ng-formly/pull/319) ([aitboudad](https://github.com/aitboudad))
- changelog updated [\#316](https://github.com/formly-js/ng-formly/pull/316) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(upgrade\) update version to beta 14 [\#315](https://github.com/formly-js/ng-formly/pull/315) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.14](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.14) (2016-12-07)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.13...v2.0.0-beta.14)

**Implemented enhancements:**

- Custom Validators with `expression +  message` [\#269](https://github.com/formly-js/ng-formly/issues/269)
- valueProp and labelProp in type select [\#258](https://github.com/formly-js/ng-formly/issues/258)
- Upgrade to 2.2.0 [\#257](https://github.com/formly-js/ng-formly/issues/257)
- FIELD TRANSFORM [\#246](https://github.com/formly-js/ng-formly/issues/246)
- Model binding to a formly-field in FormlyForm will not work with a nested property [\#230](https://github.com/formly-js/ng-formly/issues/230)
- Grouped Select [\#202](https://github.com/formly-js/ng-formly/issues/202)
- Add unit tests [\#182](https://github.com/formly-js/ng-formly/issues/182)
- Expression properties should be able to take function [\#148](https://github.com/formly-js/ng-formly/issues/148)

**Closed issues:**

- How can i implement repeating section using ng2-formly [\#312](https://github.com/formly-js/ng-formly/issues/312)
- Not getting Typescript and Webpack config when using github and npm [\#308](https://github.com/formly-js/ng-formly/issues/308)
- repeated section produces errors [\#303](https://github.com/formly-js/ng-formly/issues/303)
- Allow for periods in key of radio [\#301](https://github.com/formly-js/ng-formly/issues/301)
- RepeatSection cannot be reset properly. [\#288](https://github.com/formly-js/ng-formly/issues/288)
- Field with nested property loses wrappers [\#282](https://github.com/formly-js/ng-formly/issues/282)
- Change needs to be added to FormlyTemplateOptions [\#279](https://github.com/formly-js/ng-formly/issues/279)
- OnChange isn't working when set async \(Like on an RXJS subject\) [\#277](https://github.com/formly-js/ng-formly/issues/277)
- Request for an example for options for select field from a remote API through a service [\#271](https://github.com/formly-js/ng-formly/issues/271)
- \[Field type\] get model value using `model\[key\]` instead of `model` [\#265](https://github.com/formly-js/ng-formly/issues/265)
- Formly in Tabs [\#263](https://github.com/formly-js/ng-formly/issues/263)
- Need CONTRIBUTING.md file for the project [\#262](https://github.com/formly-js/ng-formly/issues/262)
- event async loading in a field select [\#255](https://github.com/formly-js/ng-formly/issues/255)
- Run time error while running to the device [\#239](https://github.com/formly-js/ng-formly/issues/239)

**Merged pull requests:**

- chore\(changelog\) update change log [\#314](https://github.com/formly-js/ng-formly/pull/314) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- add code tag for @jrgleason [\#310](https://github.com/formly-js/ng-formly/pull/310) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- These need to be added if we want to build locally issue \#308 [\#309](https://github.com/formly-js/ng-formly/pull/309) ([jrgleason](https://github.com/jrgleason))
- Make the test pass [\#306](https://github.com/formly-js/ng-formly/pull/306) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix: Allow for nested properties in Radiobutton [\#305](https://github.com/formly-js/ng-formly/pull/305) ([Krustie101](https://github.com/Krustie101))
- feat\(resetModel\): update options.resetModel to accept an optional model [\#304](https://github.com/formly-js/ng-formly/pull/304) ([franzeal](https://github.com/franzeal))
- fix\(Default Value\) Save default value at correct location [\#302](https://github.com/formly-js/ng-formly/pull/302) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- upgrade codelyzer and tslint [\#300](https://github.com/formly-js/ng-formly/pull/300) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Add @Krustie101 and @ultimafirez as a contributor [\#299](https://github.com/formly-js/ng-formly/pull/299) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- test\(coverage\) increasing coverage [\#298](https://github.com/formly-js/ng-formly/pull/298) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- test\(AsyncValidation\) testing asyncValidation [\#296](https://github.com/formly-js/ng-formly/pull/296) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(demo\) running demo on windows [\#295](https://github.com/formly-js/ng-formly/pull/295) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(reset\) FormArray reset [\#294](https://github.com/formly-js/ng-formly/pull/294) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- \#230 added methods to extract nested properties & create empty objects [\#293](https://github.com/formly-js/ng-formly/pull/293) ([Krustie101](https://github.com/Krustie101))
- feat\(expressionProperties\): cache build expression during form build [\#292](https://github.com/formly-js/ng-formly/pull/292) ([aitboudad](https://github.com/aitboudad))
- Create CONTRIBUTING.md [\#290](https://github.com/formly-js/ng-formly/pull/290) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Expression properties should be able to take function \(\#148\) [\#289](https://github.com/formly-js/ng-formly/pull/289) ([Riron](https://github.com/Riron))
- feat\(Lifecycle\) pass key params to lifecycle events [\#287](https://github.com/formly-js/ng-formly/pull/287) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- docs\(Example\) use a service inside onInit [\#286](https://github.com/formly-js/ng-formly/pull/286) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Contributors [\#285](https://github.com/formly-js/ng-formly/pull/285) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(\#282\): fixed merge field options with nested property key [\#284](https://github.com/formly-js/ng-formly/pull/284) ([aitboudad](https://github.com/aitboudad))
- feat\(utils\): improve usage of formly-utils [\#283](https://github.com/formly-js/ng-formly/pull/283) ([aitboudad](https://github.com/aitboudad))
- feat\(HideExpression\) add consistent context to function expression [\#281](https://github.com/formly-js/ng-formly/pull/281) ([franzeal](https://github.com/franzeal))
- fix\(Config\) have the events in templateOptions [\#280](https://github.com/formly-js/ng-formly/pull/280) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(GroupedSelect\) Support Grouped Select [\#278](https://github.com/formly-js/ng-formly/pull/278) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(addon\): add `addonRight` [\#276](https://github.com/formly-js/ng-formly/pull/276) ([aitboudad](https://github.com/aitboudad))
- Add @franzeal as a contributor [\#275](https://github.com/formly-js/ng-formly/pull/275) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(\#258\) valueProp and labelProp in type select [\#274](https://github.com/formly-js/ng-formly/pull/274) ([franzeal](https://github.com/franzeal))
- feat\(\#269\): custom Validators with `expression + message` [\#273](https://github.com/formly-js/ng-formly/pull/273) ([aitboudad](https://github.com/aitboudad))
- feat\(formState\): support `formState` in expressionProperties [\#272](https://github.com/formly-js/ng-formly/pull/272) ([aitboudad](https://github.com/aitboudad))
- feat\(formState\): add `formState` in FieldType [\#268](https://github.com/formly-js/ng-formly/pull/268) ([aitboudad](https://github.com/aitboudad))
- feat\(templateOptions\): deprecate 'templateOptions' in favor of 'to'. [\#267](https://github.com/formly-js/ng-formly/pull/267) ([aitboudad](https://github.com/aitboudad))
- fix\(\#265\): \[Field type\] get model value using `model\[key\]` [\#266](https://github.com/formly-js/ng-formly/pull/266) ([aitboudad](https://github.com/aitboudad))
- test\(test-watch\): show interim coverage report [\#264](https://github.com/formly-js/ng-formly/pull/264) ([aitboudad](https://github.com/aitboudad))
- Update README.md [\#261](https://github.com/formly-js/ng-formly/pull/261) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Update README.md [\#260](https://github.com/formly-js/ng-formly/pull/260) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(update\): Update Dependencies [\#259](https://github.com/formly-js/ng-formly/pull/259) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(FieldTransform\) Implementation of Field Transform [\#256](https://github.com/formly-js/ng-formly/pull/256) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(upgrade\): Update to 2.0.0-beta.13 [\#254](https://github.com/formly-js/ng-formly/pull/254) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.13](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.13) (2016-11-14)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.12...v2.0.0-beta.13)

**Merged pull requests:**

- fix\(FormlyField\): subscribe to FormControl only when field has a key [\#252](https://github.com/formly-js/ng-formly/pull/252) ([aitboudad](https://github.com/aitboudad))
- fix\(npmignore\): allow `src` folder [\#251](https://github.com/formly-js/ng-formly/pull/251) ([aitboudad](https://github.com/aitboudad))
- chore\(upgrade\): upgrade version [\#243](https://github.com/formly-js/ng-formly/pull/243) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.12](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.12) (2016-11-12)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.11...v2.0.0-beta.12)

**Implemented enhancements:**

- addonLeft and addonRight [\#223](https://github.com/formly-js/ng-formly/issues/223)
- Layout broken with Bootstrap v4 flexbox support enabled [\#215](https://github.com/formly-js/ng-formly/issues/215)
- formState implementation [\#203](https://github.com/formly-js/ng-formly/issues/203)
- defaultOption for a type [\#200](https://github.com/formly-js/ng-formly/issues/200)
- setType should also be able to take an array [\#199](https://github.com/formly-js/ng-formly/issues/199)
- add support for Form Options [\#172](https://github.com/formly-js/ng-formly/issues/172)
- Adding more templateOptions [\#171](https://github.com/formly-js/ng-formly/issues/171)
- Support for Async Validation [\#165](https://github.com/formly-js/ng-formly/issues/165)
- Handling onKeypress, onEnter, onLeave, onClick, onFocus, onBlur, onChange etc. [\#147](https://github.com/formly-js/ng-formly/issues/147)
- Support templateManipulators [\#25](https://github.com/formly-js/ng-formly/issues/25)

**Closed issues:**

- Running npm run demo fails on windows. [\#233](https://github.com/formly-js/ng-formly/issues/233)
- Formly-form controls are not rebound if model is changed programmatically [\#229](https://github.com/formly-js/ng-formly/issues/229)
- Extra formly tags removal [\#225](https://github.com/formly-js/ng-formly/issues/225)
- FormlyWrapperHorizontalLabel [\#220](https://github.com/formly-js/ng-formly/issues/220)
- Form Generator [\#135](https://github.com/formly-js/ng-formly/issues/135)
- \[Doc\]\[Field Type\] create custom controls [\#115](https://github.com/formly-js/ng-formly/issues/115)

**Merged pull requests:**

- Create PULL\_REQUEST\_TEMPLATE.md [\#250](https://github.com/formly-js/ng-formly/pull/250) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Revert "Create PULL\_REQUEST\_TEMPLATE.md" [\#249](https://github.com/formly-js/ng-formly/pull/249) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Create ISSUE\_TEMPLATE.md [\#248](https://github.com/formly-js/ng-formly/pull/248) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Create PULL\_REQUEST\_TEMPLATE.md [\#247](https://github.com/formly-js/ng-formly/pull/247) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- test\(FormlyFormBuilder\): add tests + small fixes. [\#244](https://github.com/formly-js/ng-formly/pull/244) ([aitboudad](https://github.com/aitboudad))
- feat\(AsyncValidator\) Add asyncValidator instead of asyncValidation [\#242](https://github.com/formly-js/ng-formly/pull/242) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(formReset\) Form Reset functionality using options [\#241](https://github.com/formly-js/ng-formly/pull/241) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(\#239\): aot compiler enable TemplateCodegen. [\#240](https://github.com/formly-js/ng-formly/pull/240) ([aitboudad](https://github.com/aitboudad))
- fix\(\#229\): fixed formly-form model changes [\#238](https://github.com/formly-js/ng-formly/pull/238) ([aitboudad](https://github.com/aitboudad))
- fix\(\#233\): remove usage of `NODE\_ENV` + small cleanup [\#237](https://github.com/formly-js/ng-formly/pull/237) ([aitboudad](https://github.com/aitboudad))
- feat\(options\) options part1 \(example of formState-readOnly [\#236](https://github.com/formly-js/ng-formly/pull/236) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(fomrly-form\): introduce FormBuilder service [\#235](https://github.com/formly-js/ng-formly/pull/235) ([aitboudad](https://github.com/aitboudad))
- feat\(Parsers\) Implement Parsers [\#234](https://github.com/formly-js/ng-formly/pull/234) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- defaultOptions [\#232](https://github.com/formly-js/ng-formly/pull/232) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Accessibility\) add aria-describedby for error messages [\#227](https://github.com/formly-js/ng-formly/pull/227) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- test\(FormlyField\): add tests. [\#226](https://github.com/formly-js/ng-formly/pull/226) ([aitboudad](https://github.com/aitboudad))
- feat\(Events\) add events to TemplateOptions [\#224](https://github.com/formly-js/ng-formly/pull/224) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(templateManipulators\) Add template Manipulators functionality [\#222](https://github.com/formly-js/ng-formly/pull/222) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(\#220\): update readme [\#221](https://github.com/formly-js/ng-formly/pull/221) ([aitboudad](https://github.com/aitboudad))
- fix\(travis\): fix travis failure + small cleanup [\#219](https://github.com/formly-js/ng-formly/pull/219) ([aitboudad](https://github.com/aitboudad))
- feat\(FormlyField\) Support for flexbox classes [\#218](https://github.com/formly-js/ng-formly/pull/218) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- refactor\(FormlyConfig\): remove useless `if` statement [\#217](https://github.com/formly-js/ng-formly/pull/217) ([aitboudad](https://github.com/aitboudad))
- feat\(FormlyConfig\) setType can accept array of options [\#216](https://github.com/formly-js/ng-formly/pull/216) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(upgrade\) upgreade to 2.0.0-beta.11 [\#214](https://github.com/formly-js/ng-formly/pull/214) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.11](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.11) (2016-11-01)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.10...v2.0.0-beta.11)

**Implemented enhancements:**

- field and fieldGroup wrapper [\#204](https://github.com/formly-js/ng-formly/issues/204)

**Closed issues:**

- Radio buttons don't have names, so you can't use multiple groups [\#210](https://github.com/formly-js/ng-formly/issues/210)
- Code Coverage report not showing any data [\#190](https://github.com/formly-js/ng-formly/issues/190)

**Merged pull requests:**

- Add @danielcrisp as a contributor [\#213](https://github.com/formly-js/ng-formly/pull/213) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Prevent collisions between multiple radio groups and multicheckbox groups [\#212](https://github.com/formly-js/ng-formly/pull/212) ([danielcrisp](https://github.com/danielcrisp))
- refactor\(form id\): move generate id to the formly-form. [\#211](https://github.com/formly-js/ng-formly/pull/211) ([aitboudad](https://github.com/aitboudad))
- refactor\(FormlyAttributes\): add tests + use field as input instead of  templateOptions. [\#209](https://github.com/formly-js/ng-formly/pull/209) ([aitboudad](https://github.com/aitboudad))
- Code cov [\#208](https://github.com/formly-js/ng-formly/pull/208) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(coverage\): add code coverage report. [\#206](https://github.com/formly-js/ng-formly/pull/206) ([aitboudad](https://github.com/aitboudad))
- feat\(FieldWrapper\) FieldWrapper [\#205](https://github.com/formly-js/ng-formly/pull/205) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(yarn\) yarn all the way :D [\#201](https://github.com/formly-js/ng-formly/pull/201) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- refactor\(bootstrap\): move bootstrap templates to `ui-bootstrap` folder [\#198](https://github.com/formly-js/ng-formly/pull/198) ([aitboudad](https://github.com/aitboudad))
- chore\(upgrade\) upgrade to 2.0.0-beta.10 [\#197](https://github.com/formly-js/ng-formly/pull/197) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.10](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.10) (2016-10-29)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.9...v2.0.0-beta.10)

**Closed issues:**

- Form does not initialize inner properties  [\#192](https://github.com/formly-js/ng-formly/issues/192)

**Merged pull requests:**

- refactor\(Validation\): rename FromlyMessage to FormlyValidationMessage [\#196](https://github.com/formly-js/ng-formly/pull/196) ([aitboudad](https://github.com/aitboudad))
- feat\(FormArray\) Support for FormArray, demo with repeated section [\#195](https://github.com/formly-js/ng-formly/pull/195) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(\#192\): fixed initialize inner properties [\#194](https://github.com/formly-js/ng-formly/pull/194) ([aitboudad](https://github.com/aitboudad))
- chore\(Contributors\) Add allcontributors to add contribution to readme [\#193](https://github.com/formly-js/ng-formly/pull/193) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- test\(FormlyMessage\): add unit tests. [\#188](https://github.com/formly-js/ng-formly/pull/188) ([aitboudad](https://github.com/aitboudad))
- feat\(FormlyField\) generate unique id's for the form" [\#187](https://github.com/formly-js/ng-formly/pull/187) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- upgrade to 2.0.0-beta.9 [\#186](https://github.com/formly-js/ng-formly/pull/186) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.9](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.9) (2016-10-27)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/v2.0.0-beta.8...v2.0.0-beta.9)

**Implemented enhancements:**

- Merging validators and validation as well as asyncValidators and asyncValidation [\#170](https://github.com/formly-js/ng-formly/issues/170)
- Add Unit tests [\#79](https://github.com/formly-js/ng-formly/issues/79)

**Closed issues:**

- Add an event on form controls ready [\#183](https://github.com/formly-js/ng-formly/issues/183)

**Merged pull requests:**

- test\(FormlyConfig\): add unit tests [\#184](https://github.com/formly-js/ng-formly/pull/184) ([aitboudad](https://github.com/aitboudad))
- feat\(\#79\): Add initial work for Unit tests [\#181](https://github.com/formly-js/ng-formly/pull/181) ([aitboudad](https://github.com/aitboudad))
- feat\(TemplateOption\) added tabindex, placeholder, step to be handled … [\#179](https://github.com/formly-js/ng-formly/pull/179) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(upgrade\) upgrade to 2.0.0-beta.8 [\#178](https://github.com/formly-js/ng-formly/pull/178) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [v2.0.0-beta.8](https://github.com/formly-js/ng-formly/tree/v2.0.0-beta.8) (2016-10-26)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.7...v2.0.0-beta.8)

**Implemented enhancements:**

- Simpler Validation [\#163](https://github.com/formly-js/ng-formly/issues/163)
- defaultValue property for a field [\#154](https://github.com/formly-js/ng-formly/issues/154)
- Template Options should be able to accept additional Custom options [\#152](https://github.com/formly-js/ng-formly/issues/152)
- Lifecycle Hooks in Formly [\#150](https://github.com/formly-js/ng-formly/issues/150)
- Should be able to define the types for the wrappers [\#146](https://github.com/formly-js/ng-formly/issues/146)
- Dynamic Validation Messages [\#136](https://github.com/formly-js/ng-formly/issues/136)
- Nested Property Keys [\#121](https://github.com/formly-js/ng-formly/issues/121)

**Closed issues:**

- Fetch form metadata from server [\#155](https://github.com/formly-js/ng-formly/issues/155)
- Placeholders are not optional \(display 'undefined'\) [\#140](https://github.com/formly-js/ng-formly/issues/140)
- Website for ng2-formly [\#133](https://github.com/formly-js/ng-formly/issues/133)
- update ngModule way of using ng2-formly in README.md [\#114](https://github.com/formly-js/ng-formly/issues/114)

**Merged pull requests:**

- feat\(ValidationMessages\) Messages should have info of fields [\#177](https://github.com/formly-js/ng-formly/pull/177) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Validation\) validation.show implementation [\#176](https://github.com/formly-js/ng-formly/pull/176) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Validation\) Validation property in Validators property [\#175](https://github.com/formly-js/ng-formly/pull/175) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Validation\) Some basic validations in templateOptions [\#174](https://github.com/formly-js/ng-formly/pull/174) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- style\(tslint\): add more codelyzer rules. [\#173](https://github.com/formly-js/ng-formly/pull/173) ([aitboudad](https://github.com/aitboudad))
- feat\(travis\): use yarn + remove unused libs [\#169](https://github.com/formly-js/ng-formly/pull/169) ([aitboudad](https://github.com/aitboudad))
- feat\(validation\): add support for async-validation [\#168](https://github.com/formly-js/ng-formly/pull/168) ([aitboudad](https://github.com/aitboudad))
- refactor\(validation\): simplify init Field Validation. [\#167](https://github.com/formly-js/ng-formly/pull/167) ([aitboudad](https://github.com/aitboudad))
- feat\(Validation\) add Validators API [\#164](https://github.com/formly-js/ng-formly/pull/164) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(yarn\) add yarn.lock file [\#162](https://github.com/formly-js/ng-formly/pull/162) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Update README.md [\#161](https://github.com/formly-js/ng-formly/pull/161) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(tslint\) trailing comma mandatory [\#160](https://github.com/formly-js/ng-formly/pull/160) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Wrappers\) Types property can be set to wrappers [\#159](https://github.com/formly-js/ng-formly/pull/159) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(Default Value\) fix path [\#158](https://github.com/formly-js/ng-formly/pull/158) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(\#155\): allow changing fields input after init. [\#157](https://github.com/formly-js/ng-formly/pull/157) ([aitboudad](https://github.com/aitboudad))
- feat\(Default Value\) Add default Value functionility [\#156](https://github.com/formly-js/ng-formly/pull/156) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat \(TemplateOptions\) Allow additional options fixes \#152 [\#153](https://github.com/formly-js/ng-formly/pull/153) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Lifecycle Hooks\) Integrate the fields with lifecycle hooks [\#151](https://github.com/formly-js/ng-formly/pull/151) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(Validation\) Dynamic Validation Messages fixes \#136 [\#145](https://github.com/formly-js/ng-formly/pull/145) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(webpack\): add missing deps [\#144](https://github.com/formly-js/ng-formly/pull/144) ([aitboudad](https://github.com/aitboudad))
- feat\(\#121\): support Nested Property Keys. [\#143](https://github.com/formly-js/ng-formly/pull/143) ([aitboudad](https://github.com/aitboudad))
- fix\(\#121\): support nested keys [\#142](https://github.com/formly-js/ng-formly/pull/142) ([Pouja](https://github.com/Pouja))
- fix\(\#140\): assign default templateOptions. [\#141](https://github.com/formly-js/ng-formly/pull/141) ([aitboudad](https://github.com/aitboudad))
- feat\(demo\): use webpack [\#139](https://github.com/formly-js/ng-formly/pull/139) ([aitboudad](https://github.com/aitboudad))
- feat\(fieldGroup\): use FormGroup for nested keys [\#138](https://github.com/formly-js/ng-formly/pull/138) ([aitboudad](https://github.com/aitboudad))
- feat\(npm\): update packages + use peerDependencies. [\#137](https://github.com/formly-js/ng-formly/pull/137) ([aitboudad](https://github.com/aitboudad))
- docs\(bootstrap\): Update Documentation with bootstraping ng2-formly [\#134](https://github.com/formly-js/ng-formly/pull/134) ([divyakumarjain](https://github.com/divyakumarjain))
- chore\(upgrade\) Upgrade to Beta 7 [\#131](https://github.com/formly-js/ng-formly/pull/131) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-beta.7](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.7) (2016-10-05)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.6...2.0.0-beta.7)

**Implemented enhancements:**

- Group Validation [\#43](https://github.com/formly-js/ng-formly/issues/43)
- Support wrappers [\#26](https://github.com/formly-js/ng-formly/issues/26)

**Closed issues:**

- \[ts\] Cannot find module 'ng2-formly' [\#125](https://github.com/formly-js/ng-formly/issues/125)
- FormlyModule imports BrowserModule [\#123](https://github.com/formly-js/ng-formly/issues/123)

**Merged pull requests:**

- feat\(formly-field\) support extending types \(with docs\) [\#129](https://github.com/formly-js/ng-formly/pull/129) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- style\(tslint\): \[quotemark\] enforces single quotes [\#128](https://github.com/formly-js/ng-formly/pull/128) ([aitboudad](https://github.com/aitboudad))
- feat\(formly-field\): support wrappers [\#127](https://github.com/formly-js/ng-formly/pull/127) ([aitboudad](https://github.com/aitboudad))
- feat\(umd\): use webpack for umd-build. [\#126](https://github.com/formly-js/ng-formly/pull/126) ([aitboudad](https://github.com/aitboudad))
- fix\(FormlyModule\): use CommonModule instead of BrowserModule. [\#124](https://github.com/formly-js/ng-formly/pull/124) ([aitboudad](https://github.com/aitboudad))
- feat\(FormlyModule\): improve registering types, validators and validationMessage. [\#122](https://github.com/formly-js/ng-formly/pull/122) ([aitboudad](https://github.com/aitboudad))
- feat\(build\): Use ngc for AOT compilation & distribute ES modules + UMD bundle. [\#120](https://github.com/formly-js/ng-formly/pull/120) ([aitboudad](https://github.com/aitboudad))
- feat\(modelOptions\) Better way of handling debounce [\#119](https://github.com/formly-js/ng-formly/pull/119) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(FormlyConfig\): throw error when a type/validator doesn't exist. [\#118](https://github.com/formly-js/ng-formly/pull/118) ([aitboudad](https://github.com/aitboudad))
- feat\(modelOptions\) Basic Implementation of modelOptions with debounce… [\#117](https://github.com/formly-js/ng-formly/pull/117) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- refactor\(FormlyField\): remove `FormlyCommon` class. [\#116](https://github.com/formly-js/ng-formly/pull/116) ([aitboudad](https://github.com/aitboudad))
- docs\(validation\) Group Validation added fixes \#43 [\#113](https://github.com/formly-js/ng-formly/pull/113) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(changedetection\): remove the temporary fix `setTimeout`. [\#112](https://github.com/formly-js/ng-formly/pull/112) ([aitboudad](https://github.com/aitboudad))

## [2.0.0-beta.6](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.6) (2016-09-30)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.5...2.0.0-beta.6)

**Implemented enhancements:**

- Support @angular/form 2.0.0-rc.6 [\#92](https://github.com/formly-js/ng-formly/issues/92)
- SingleFocusDispatcher  not exported via index.ts [\#81](https://github.com/formly-js/ng-formly/issues/81)
- Add ng2Module support [\#80](https://github.com/formly-js/ng-formly/issues/80)
- Support Angular Universal [\#53](https://github.com/formly-js/ng-formly/issues/53)
- Support for Validation to be An Array of strings [\#41](https://github.com/formly-js/ng-formly/issues/41)
- 'focus' can only be true for one field [\#12](https://github.com/formly-js/ng-formly/issues/12)

**Fixed bugs:**

- css class form-control missing in most templates [\#82](https://github.com/formly-js/ng-formly/issues/82)
- Two Way binding for Radio button does not work [\#54](https://github.com/formly-js/ng-formly/issues/54)
- Demo throws error on Chrome \(only on MAC\) a [\#47](https://github.com/formly-js/ng-formly/issues/47)

**Closed issues:**

- Chrome Autofill Form throws error [\#108](https://github.com/formly-js/ng-formly/issues/108)
- No value accessor for form control with name: 'password' \[In Demo\] [\#102](https://github.com/formly-js/ng-formly/issues/102)
- Can we add aitboudad o the angular 2 formly core team? [\#100](https://github.com/formly-js/ng-formly/issues/100)
- Validation occurs before the user interacts with the form fields [\#97](https://github.com/formly-js/ng-formly/issues/97)
- NPM install not working [\#95](https://github.com/formly-js/ng-formly/issues/95)
- Invalid provider - only instances of Provider and Type are allowed, got: undefined [\#90](https://github.com/formly-js/ng-formly/issues/90)
- Can't bind to 'ngFormModel' [\#89](https://github.com/formly-js/ng-formly/issues/89)
- Repository for material templates [\#88](https://github.com/formly-js/ng-formly/issues/88)
- FormlyForm directive is error. [\#83](https://github.com/formly-js/ng-formly/issues/83)
- Several templates not checking for disabled attribute [\#75](https://github.com/formly-js/ng-formly/issues/75)
- Feature requests: add styling support for field-groups and make fields optional [\#74](https://github.com/formly-js/ng-formly/issues/74)
- Use @angular/formly instead of deprecated forms api breaks radio button [\#72](https://github.com/formly-js/ng-formly/issues/72)
- Update ng2-formly to use @angular/formly instead of deprecated forms api [\#70](https://github.com/formly-js/ng-formly/issues/70)
- ng2-formly.min.js:1 Uncaught ReferenceError: System is not defined [\#68](https://github.com/formly-js/ng-formly/issues/68)
- select options not showing [\#67](https://github.com/formly-js/ng-formly/issues/67)
- EXCEPTION: No Directive annotation found on FormlyForm [\#66](https://github.com/formly-js/ng-formly/issues/66)
- Aurelia-formly [\#63](https://github.com/formly-js/ng-formly/issues/63)
- Update to RC3 - dynamic form [\#62](https://github.com/formly-js/ng-formly/issues/62)
- Upgrade to RC2 [\#59](https://github.com/formly-js/ng-formly/issues/59)

**Merged pull requests:**

- chore\(upgrade\) Upgrade to 2.0.0-beta.6 [\#111](https://github.com/formly-js/ng-formly/pull/111) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat\(validation\) Support for Validation Array fixes \#41 [\#110](https://github.com/formly-js/ng-formly/pull/110) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- fix\(focus\): fixed chrome Autofill Form error. [\#109](https://github.com/formly-js/ng-formly/pull/109) ([aitboudad](https://github.com/aitboudad))
- feat\(focus\): move `focusDispatcher` to `formlyNgFocus` directive. [\#107](https://github.com/formly-js/ng-formly/pull/107) ([aitboudad](https://github.com/aitboudad))
- feat\(focus\): replace `setNativeFocusProperty` with `formlyNgFocus` directive [\#106](https://github.com/formly-js/ng-formly/pull/106) ([aitboudad](https://github.com/aitboudad))
- fix\(formlyField\): fixed two way Data Binding issue [\#104](https://github.com/formly-js/ng-formly/pull/104) ([aitboudad](https://github.com/aitboudad))
- fix\(\#102\): avoid using reserved form input names\(formControlName, formGroup\). [\#103](https://github.com/formly-js/ng-formly/pull/103) ([aitboudad](https://github.com/aitboudad))
- feat\(angular\): Add support for angular@2.0 [\#101](https://github.com/formly-js/ng-formly/pull/101) ([aitboudad](https://github.com/aitboudad))
- fix\(validation\): validation occurs before the user interacts. [\#99](https://github.com/formly-js/ng-formly/pull/99) ([aitboudad](https://github.com/aitboudad))
- Update Readme. [\#98](https://github.com/formly-js/ng-formly/pull/98) ([aitboudad](https://github.com/aitboudad))
- feat\(typescript\): Updated typescript + removed typings [\#96](https://github.com/formly-js/ng-formly/pull/96) ([aitboudad](https://github.com/aitboudad))
- feat\(tslint\): added codelyzer. [\#94](https://github.com/formly-js/ng-formly/pull/94) ([aitboudad](https://github.com/aitboudad))
- feat\(formly-form\): move `form` out of `formly-form` component. [\#93](https://github.com/formly-js/ng-formly/pull/93) ([aitboudad](https://github.com/aitboudad))
- Add ng2Module support [\#86](https://github.com/formly-js/ng-formly/pull/86) ([aitboudad](https://github.com/aitboudad))
- fix\(style\): fix \#82 by adding form-control & form-group css classes where missing [\#85](https://github.com/formly-js/ng-formly/pull/85) ([divyakumarjain](https://github.com/divyakumarjain))
- fix\(radio\): fix \#81 by exporting SingleFocusDispatcher via templates [\#84](https://github.com/formly-js/ng-formly/pull/84) ([divyakumarjain](https://github.com/divyakumarjain))
- Fix issue with field groups where initial value of model is undefined. [\#78](https://github.com/formly-js/ng-formly/pull/78) ([divyakumarjain](https://github.com/divyakumarjain))
- fix \#74 by minimizing nesting level of angular directive/components and divs [\#77](https://github.com/formly-js/ng-formly/pull/77) ([divyakumarjain](https://github.com/divyakumarjain))
- fix\(template\): fix issue 75 by adding disable attribute input template [\#76](https://github.com/formly-js/ng-formly/pull/76) ([divyakumarjain](https://github.com/divyakumarjain))
- fix\(radio\): closes \#72 [\#73](https://github.com/formly-js/ng-formly/pull/73) ([divyakumarjain](https://github.com/divyakumarjain))
- Initial commit for ng2-formly with @angular/forms which replaces deprecated forms api [\#71](https://github.com/formly-js/ng-formly/pull/71) ([divyakumarjain](https://github.com/divyakumarjain))
- waffle.io Badge [\#65](https://github.com/formly-js/ng-formly/pull/65) ([waffle-iron](https://github.com/waffle-iron))
- fix\(focus\): Fixes \#12 by adding focus property to the input template [\#64](https://github.com/formly-js/ng-formly/pull/64) ([divyakumarjain](https://github.com/divyakumarjain))
- Fixes \#53 by using angular renderer [\#61](https://github.com/formly-js/ng-formly/pull/61) ([divyakumarjain](https://github.com/divyakumarjain))
- fix\(radiobutton\): Fixes \#54 issue with two way binding of radio button [\#60](https://github.com/formly-js/ng-formly/pull/60) ([divyakumarjain](https://github.com/divyakumarjain))
- docs\(readme\): Make minor corrections [\#57](https://github.com/formly-js/ng-formly/pull/57) ([micouz](https://github.com/micouz))

## [2.0.0-beta.5](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.5) (2016-06-01)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.4...2.0.0-beta.5)

**Fixed bugs:**

- Version 2.0.0-beta.3 typings error at installation [\#48](https://github.com/formly-js/ng-formly/issues/48)
- Two way Data Binding [\#45](https://github.com/formly-js/ng-formly/issues/45)

**Closed issues:**

- extend and multiple inheritance [\#56](https://github.com/formly-js/ng-formly/issues/56)
- More Repo to separate Core with Templates [\#55](https://github.com/formly-js/ng-formly/issues/55)
- Can we add divyakumarjain to angular2 formly core team member? [\#51](https://github.com/formly-js/ng-formly/issues/51)

**Merged pull requests:**

- fix\(formBinding\): Fix for two way binding issue [\#50](https://github.com/formly-js/ng-formly/pull/50) ([divyakumarjain](https://github.com/divyakumarjain))

## [2.0.0-beta.4](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.4) (2016-05-28)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.3...2.0.0-beta.4)

**Merged pull requests:**

- Close \#48 - beta.3 release issues [\#49](https://github.com/formly-js/ng-formly/pull/49) ([micouz](https://github.com/micouz))

## [2.0.0-beta.3](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.3) (2016-05-26)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.2...2.0.0-beta.3)

**Closed issues:**

- Typescript not compiling since 2.0.0-beta.1 [\#42](https://github.com/formly-js/ng-formly/issues/42)
- Uncaught ReferenceError: System is not defined [\#39](https://github.com/formly-js/ng-formly/issues/39)

**Merged pull requests:**

- Fix build - close \#39 and \#42 [\#46](https://github.com/formly-js/ng-formly/pull/46) ([micouz](https://github.com/micouz))
- feat\(formly-form\) remove unnessary event system to send data to forml… [\#44](https://github.com/formly-js/ng-formly/pull/44) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-beta.2](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.2) (2016-05-18)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-beta.1...2.0.0-beta.2)

**Implemented enhancements:**

- Not working expressionProperties  [\#24](https://github.com/formly-js/ng-formly/issues/24)
- Separate Formly and Templates [\#15](https://github.com/formly-js/ng-formly/issues/15)
- templateOptions should be defined [\#13](https://github.com/formly-js/ng-formly/issues/13)

**Fixed bugs:**

- error TS2307: Cannot find module './control.service'. [\#32](https://github.com/formly-js/ng-formly/issues/32)

**Closed issues:**

- Update to Angular 2.RC1 [\#35](https://github.com/formly-js/ng-formly/issues/35)
- not bundle with webpack \(lost control.service.d.ts\) [\#18](https://github.com/formly-js/ng-formly/issues/18)

**Merged pull requests:**

- feat\(expressionProperties\): implemented expressionProperties [\#40](https://github.com/formly-js/ng-formly/pull/40) ([divyakumarjain](https://github.com/divyakumarjain))
- Remove Control Service [\#38](https://github.com/formly-js/ng-formly/pull/38) ([divyakumarjain](https://github.com/divyakumarjain))
- feat\(upgrade\) Upgrade Angular to Angular2-RC.1 [\#37](https://github.com/formly-js/ng-formly/pull/37) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-beta.1](https://github.com/formly-js/ng-formly/tree/2.0.0-beta.1) (2016-05-14)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-alpha.5...2.0.0-beta.1)

**Implemented enhancements:**

- Hide expression should be able to receive Expressions [\#14](https://github.com/formly-js/ng-formly/issues/14)
- Supporting Multi Checkbox [\#9](https://github.com/formly-js/ng-formly/issues/9)

**Closed issues:**

- npm script flow.compile:system not working on windows [\#29](https://github.com/formly-js/ng-formly/issues/29)
- Differentiator with Ng2 Forms [\#22](https://github.com/formly-js/ng-formly/issues/22)
- Efforts towards a web components/vanilla js formly core library [\#21](https://github.com/formly-js/ng-formly/issues/21)
- support for typeahead [\#19](https://github.com/formly-js/ng-formly/issues/19)

**Merged pull requests:**

- feat\(core\): Implemented support for hideExpression [\#36](https://github.com/formly-js/ng-formly/pull/36) ([divyakumarjain](https://github.com/divyakumarjain))
- Updated version in the example. [\#34](https://github.com/formly-js/ng-formly/pull/34) ([MathijsHoogland](https://github.com/MathijsHoogland))
- Fixing typo and clarifying statement [\#33](https://github.com/formly-js/ng-formly/pull/33) ([TheMcMurder](https://github.com/TheMcMurder))
- fix\(build\): fix \#29 on windows [\#31](https://github.com/formly-js/ng-formly/pull/31) ([divyakumarjain](https://github.com/divyakumarjain))
- chore\(style\): Added editorconfig, Added tslint as part of npm script [\#30](https://github.com/formly-js/ng-formly/pull/30) ([divyakumarjain](https://github.com/divyakumarjain))
- feat\(components\): Supporting Multi Checkbox [\#28](https://github.com/formly-js/ng-formly/pull/28) ([divyakumarjain](https://github.com/divyakumarjain))
- Update angular to version Beta 17 [\#20](https://github.com/formly-js/ng-formly/pull/20) ([Mig1st4ck](https://github.com/Mig1st4ck))
- Adding Tslint [\#17](https://github.com/formly-js/ng-formly/pull/17) ([divyakumarjain](https://github.com/divyakumarjain))
- Add Unit test framework [\#16](https://github.com/formly-js/ng-formly/pull/16) ([divyakumarjain](https://github.com/divyakumarjain))
- feat \(npm\) Making the project ready for npm [\#11](https://github.com/formly-js/ng-formly/pull/11) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-alpha.5](https://github.com/formly-js/ng-formly/tree/2.0.0-alpha.5) (2016-04-13)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-alpha.1...2.0.0-alpha.5)

**Implemented enhancements:**

- Bundle into one JS file for npm installs [\#7](https://github.com/formly-js/ng-formly/issues/7)

**Merged pull requests:**

- feat\(templates\): Templates updated to reflect Bootstrap 4 [\#10](https://github.com/formly-js/ng-formly/pull/10) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-alpha.1](https://github.com/formly-js/ng-formly/tree/2.0.0-alpha.1) (2016-04-12)
[Full Changelog](https://github.com/formly-js/ng-formly/compare/2.0.0-alpha.0...2.0.0-alpha.1)

**Merged pull requests:**

- feat\(templates\): Add new templates for textarea and radio [\#8](https://github.com/formly-js/ng-formly/pull/8) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- chore\(commit\): Added Commitizen support for commit messages [\#6](https://github.com/formly-js/ng-formly/pull/6) ([mohammedzamakhan](https://github.com/mohammedzamakhan))

## [2.0.0-alpha.0](https://github.com/formly-js/ng-formly/tree/2.0.0-alpha.0) (2016-04-08)
**Closed issues:**

- Angular is Beta, so Formly development makes sense now [\#2](https://github.com/formly-js/ng-formly/issues/2)
- would like to help in angular2 migration [\#1](https://github.com/formly-js/ng-formly/issues/1)

**Merged pull requests:**

- feat \(HideExpression\) Added Initial Changes for HideExpression Implem… [\#5](https://github.com/formly-js/ng-formly/pull/5) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- feat \(typings\) Added Typing support [\#4](https://github.com/formly-js/ng-formly/pull/4) ([mohammedzamakhan](https://github.com/mohammedzamakhan))
- Formly Form and Formly Field Components with basic services [\#3](https://github.com/formly-js/ng-formly/pull/3) ([mohammedzamakhan](https://github.com/mohammedzamakhan))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
