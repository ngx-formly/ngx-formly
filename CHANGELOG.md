# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0-next.4](https://github.com/ngx-formly/ngx-formly/compare/v6.0.0-next.1...v6.0.0-next.4) (2021-12-01)

To upgrade from 5.0 to 6.0 see [UPGRADE-6.0](./UPGRADE-6.0.md)

### ⚠ BREAKING CHANGES

* Formly v6 now requires Angular Version >= 13
* **bootstrap:** The two first argument of `onClick` handler has been replaced by `field` instance

### Features

* **bootstrap:** change `add-on::onClick` callback signature ([f063d2b](https://github.com/ngx-formly/ngx-formly/commit/f063d2b7621b0ba2043b1063aeeb4eab3d65ca43)), closes [#2617](https://github.com/ngx-formly/ngx-formly/issues/2617)
* **bootstrap:** update bootstrap to v5 ([#2846](https://github.com/ngx-formly/ngx-formly/issues/2846)) ([6130804](https://github.com/ngx-formly/ngx-formly/commit/61308046c8b061f66ec7384dd7f34113261517fb))
* **core:**  add helper function to get the field by key ([#3040](https://github.com/ngx-formly/ngx-formly/issues/3040)) ([43cce72](https://github.com/ngx-formly/ngx-formly/commit/43cce72d1c12e57fbe9583536436ffb8bdaa6417)), closes [#2854](https://github.com/ngx-formly/ngx-formly/issues/2854)
* **core:** allow passing function to fieldArray ([#3014](https://github.com/ngx-formly/ngx-formly/issues/3014)) ([ed4ec31](https://github.com/ngx-formly/ngx-formly/commit/ed4ec311a19f153c26f5317c64dd17255b637de2)), closes [#2809](https://github.com/ngx-formly/ngx-formly/issues/2809) [#1882](https://github.com/ngx-formly/ngx-formly/issues/1882)
* **core:** Allow passing model to updateInitialValue ([#3022](https://github.com/ngx-formly/ngx-formly/issues/3022)) ([81e8f82](https://github.com/ngx-formly/ngx-formly/commit/81e8f82903ea0e0075b70fdfc6547acab7fbd0ad)), closes [#2943](https://github.com/ngx-formly/ngx-formly/issues/2943)
* **material:** add calendarHeaderComponent input for datepicker ([#2871](https://github.com/ngx-formly/ngx-formly/issues/2871)) ([bc172ad](https://github.com/ngx-formly/ngx-formly/commit/bc172adb0fc9fea48c71baa1a27f59e4fb09fbd4)), closes [#2814](https://github.com/ngx-formly/ngx-formly/issues/2814)
* **material:** add label position input to toggle type ([#3013](https://github.com/ngx-formly/ngx-formly/issues/3013)) ([30e83a2](https://github.com/ngx-formly/ngx-formly/commit/30e83a2e84f58574e0dced090a70f8bba9c75e41)), closes [#3006](https://github.com/ngx-formly/ngx-formly/issues/3006)
* **material:** add slider missing inputs ([#2873](https://github.com/ngx-formly/ngx-formly/issues/2873)) ([015c25f](https://github.com/ngx-formly/ngx-formly/commit/015c25f0c9fd09700773a7a00c61a227061b9b84)), closes [#2110](https://github.com/ngx-formly/ngx-formly/issues/2110)
* **material:** add typeaheadDebounceInterval input for select ([#2872](https://github.com/ngx-formly/ngx-formly/issues/2872)) ([f3b8137](https://github.com/ngx-formly/ngx-formly/commit/f3b81374de56bc4e5581ce395b47deb2d190a597)), closes [#2649](https://github.com/ngx-formly/ngx-formly/issues/2649)
* **material:** pass field to suffix/prefix material template ([#3023](https://github.com/ngx-formly/ngx-formly/issues/3023)) ([1fcbb03](https://github.com/ngx-formly/ngx-formly/commit/1fcbb036e917463c24a3aa40b079d8f2f033b47c)), closes [#2895](https://github.com/ngx-formly/ngx-formly/issues/2895)
* upgrade to angular v13 ([#3062](https://github.com/ngx-formly/ngx-formly/issues/3062)) ([7dbfdec](https://github.com/ngx-formly/ngx-formly/commit/7dbfdecb37c8c97de028c3946e8ddb9c8e0d64f8)), closes [#3053](https://github.com/ngx-formly/ngx-formly/issues/3053) [#3049](https://github.com/ngx-formly/ngx-formly/issues/3049) [#2701](https://github.com/ngx-formly/ngx-formly/issues/2701) [#2958](https://github.com/ngx-formly/ngx-formly/issues/2958)


### Bug Fixes

* **core:** improve detection changes of templateOptions props ([#2971](https://github.com/ngx-formly/ngx-formly/issues/2971)) ([5996c90](https://github.com/ngx-formly/ngx-formly/commit/5996c90bcc45f6d0732f1f598e52e79d6606f015)), closes [#2961](https://github.com/ngx-formly/ngx-formly/issues/2961)

## [6.0.0-next.1](https://github.com/ngx-formly/ngx-formly/compare/v5.10.14...v6.0.0-next.1) (2021-03-23)

To upgrade from 5.0 to 6.0 see [UPGRADE-6.0](./UPGRADE-6.0.md)

### ⚠ BREAKING CHANGES

* Formly v6 now requires Angular Version >= 11
* **core:** The checkExpressionOn option is set to modelChange instead of changeDetectionCheck
* **core:** The `resetFieldOnHide` option is enabled by default
* **core:** The `lazyRender` option is enabled by default
* **core:** The initial value of the created FormControl has been changed from `null` to
`undefined` to match the field model value.
* **core:** The defaultValue for fieldGroup and fieldArray has been removed.

### Features

* **core:** add `@ngx-formly/core/testing` package ([24f503c](https://github.com/ngx-formly/ngx-formly/commit/24f503cd76324c0d8d199e18a4e8146a0fff2fdd))
* **core:** add support for inline type ([#2759](https://github.com/ngx-formly/ngx-formly/issues/2759)) ([b17ed07](https://github.com/ngx-formly/ngx-formly/commit/b17ed07a5e5bd43db587e3006eb927c2a2d6f88b)), closes [#2707](https://github.com/ngx-formly/ngx-formly/issues/2707) [#2086](https://github.com/ngx-formly/ngx-formly/issues/2086)
* **core:** allow omit formly-field element ([#2761](https://github.com/ngx-formly/ngx-formly/issues/2761)) ([6bdda2e](https://github.com/ngx-formly/ngx-formly/commit/6bdda2e50ab62513dc4ca19da7eda8940ec611ee)), closes [#2710](https://github.com/ngx-formly/ngx-formly/issues/2710) [#2756](https://github.com/ngx-formly/ngx-formly/issues/2756)
* **core:** allow control resetOnHide for a specific field ([#2721](https://github.com/ngx-formly/ngx-formly/issues/2721)) ([9630043](https://github.com/ngx-formly/ngx-formly/commit/9630043fcd00ad06893af036b4fae4242f93d94e))
* **ng-zorro-antd:** add ui-ng-zorro-antd ([3912c86](https://github.com/ngx-formly/ngx-formly/commit/3912c86881d9c42867faea20979e0c6136212650))
* **core:** add type of templateOptions accessor "to" ([#2745](https://github.com/ngx-formly/ngx-formly/issues/2745)) ([e3a4d2f](https://github.com/ngx-formly/ngx-formly/commit/e3a4d2f51a440de2dd34e01a02931785e613b2d8))
* **core:** add v6 migration guide ([#2716](https://github.com/ngx-formly/ngx-formly/issues/2716)) ([89586c9](https://github.com/ngx-formly/ngx-formly/commit/89586c97f866670d854d8f2002ff0e796fc7a59b))
* **core:** allow pass already grouped structure to select opti… ([#2091](https://github.com/ngx-formly/ngx-formly/issues/2091)) ([b5dee42](https://github.com/ngx-formly/ngx-formly/commit/b5dee42e63621e5060713a028fb7557adc06c7a8)), closes [#1580](https://github.com/ngx-formly/ngx-formly/issues/1580)
* **core:** allow passing observable for expression asyncValidators ([#1849](https://github.com/ngx-formly/ngx-formly/issues/1849)) ([c0ba5a1](https://github.com/ngx-formly/ngx-formly/commit/c0ba5a147b88dff9ab7f082af92751262da4b469))
* **core:** avoid unnecessary model changes for group/array type ([#1901](https://github.com/ngx-formly/ngx-formly/issues/1901)) ([632daef](https://github.com/ngx-formly/ngx-formly/commit/632daef7e10b76b69055203d839b55294f7a6eb7))
* **core:** check expression on change only ([#2743](https://github.com/ngx-formly/ngx-formly/issues/2743)) ([62b51d2](https://github.com/ngx-formly/ngx-formly/commit/62b51d20eb3b67e6afecabd74de6d1f20f8a71d3))
* **core:** expose build, detectChanges and checkExpressions in options ([#2328](https://github.com/ngx-formly/ngx-formly/issues/2328)) ([d75574b](https://github.com/ngx-formly/ngx-formly/commit/d75574b3cddf254a5db9d45c0ff014f7aa3e9469)), closes [#1773](https://github.com/ngx-formly/ngx-formly/issues/1773) [#1583](https://github.com/ngx-formly/ngx-formly/issues/1583)
* **core:** lazy render hidden fields by default ([#2720](https://github.com/ngx-formly/ngx-formly/issues/2720)) ([f7853f8](https://github.com/ngx-formly/ngx-formly/commit/f7853f8305c573275297aa072b750b71dda12af9))
* **core:** remove deprecated hook methods ([#2347](https://github.com/ngx-formly/ngx-formly/issues/2347)) ([b90acec](https://github.com/ngx-formly/ngx-formly/commit/b90acec828eece15d4e2c6b6e6cd3b4214e87d45))
* **core:** remove deprecated template manipulators ([b00192e](https://github.com/ngx-formly/ngx-formly/commit/b00192e31ea97347b28c6f4fa084e95949234e73))
* **core:** switch to OnPush change detection ([#2317](https://github.com/ngx-formly/ngx-formly/issues/2317)) ([810f306](https://github.com/ngx-formly/ngx-formly/commit/810f306a3b57b6ca6afc26108bf48de7daa29ad3))
* **json-schema:** map 'boolean', 'string', 'number', 'integer', 'enum' types ([#2232](https://github.com/ngx-formly/ngx-formly/issues/2232)) ([505f75f](https://github.com/ngx-formly/ngx-formly/commit/505f75f3bc461c65107389a9d1639d1d70b5aa70))
* **material:** mat-hint alignment support ([#2646](https://github.com/ngx-formly/ngx-formly/issues/2646)) ([e60eec3](https://github.com/ngx-formly/ngx-formly/commit/e60eec3dbdabc814bce29effef5718db100dee88)), closes [#2494](https://github.com/ngx-formly/ngx-formly/issues/2494)
* **material:** simplify extending custom field type ([#2742](https://github.com/ngx-formly/ngx-formly/issues/2742)) ([25dcd14](https://github.com/ngx-formly/ngx-formly/commit/25dcd14b6db5efcf36bda5c3dc6ab2314ae9b1c5))
* upgrade to Angular 9 ([#2316](https://github.com/ngx-formly/ngx-formly/issues/2316)) ([d161bbc](https://github.com/ngx-formly/ngx-formly/commit/d161bbc8efcad27a725c5e14b65845dffd14d48e))
* upgrade to angular v11 ([#2741](https://github.com/ngx-formly/ngx-formly/issues/2741)) ([9badb35](https://github.com/ngx-formly/ngx-formly/commit/9badb354f78af12d70f45c2e5416f757d7cbd7e9))
* **core:** remove deprecated methods and configs ([#1665](https://github.com/ngx-formly/ngx-formly/issues/1665)) ([229e3e4](https://github.com/ngx-formly/ngx-formly/commit/229e3e454362ca1be1006f87271e1131720e27ba))
* **core:** remove v5.5 deprecations ([#1842](https://github.com/ngx-formly/ngx-formly/issues/1842)) ([3f3e23b](https://github.com/ngx-formly/ngx-formly/commit/3f3e23b2fd7c871457e1a2d2ef25c415b6b94464))
* **core:** use undefined as defaultValue for control to match the model ([#1917](https://github.com/ngx-formly/ngx-formly/issues/1917)) ([3f66480](https://github.com/ngx-formly/ngx-formly/commit/3f6648014a63e419f8d84e5ef763fff4f593e25e)), closes [#1861](https://github.com/ngx-formly/ngx-formly/issues/1861)
* **bootstrap:** move types into separate entry points ([9142412](https://github.com/ngx-formly/ngx-formly/commit/91424125267240a7363482af2a76df061d6da7a2))
* **ionic:** move types into separate entry points ([#1570](https://github.com/ngx-formly/ngx-formly/issues/1570)) ([2a0563d](https://github.com/ngx-formly/ngx-formly/commit/2a0563dec0a10778645b5855d5ffae5c1e6340f9))
* **kendo:** move types into separate entry points ([#1569](https://github.com/ngx-formly/ngx-formly/issues/1569)) ([1d9ef8e](https://github.com/ngx-formly/ngx-formly/commit/1d9ef8ee0ea1f61467536247d42a2850746e4b6a))
* **ng-zorro-antd:** move types into separate entry points ([7f27173](https://github.com/ngx-formly/ngx-formly/commit/7f27173b4871cc9346b56590e14ab4351e62fc96))
* **primeng:** calendar support ([#2615](https://github.com/ngx-formly/ngx-formly/issues/2615)) ([ec6ec71](https://github.com/ngx-formly/ngx-formly/commit/ec6ec715adeac23a24f041db61768975c7583c9f))
* **primeng:** move types into separate entry points ([#1568](https://github.com/ngx-formly/ngx-formly/issues/1568)) ([73d277b](https://github.com/ngx-formly/ngx-formly/commit/73d277b4f143688753983879c4c82925abb666c2))


### Bug Fixes

* sync v5 branch ([ba2c384](https://github.com/ngx-formly/ngx-formly/commit/ba2c384fc3453af00ccd71dd942ef6899cb2a247))
* **core:** detect changes of formState and on rebuild ([#2335](https://github.com/ngx-formly/ngx-formly/issues/2335)) ([0beaaef](https://github.com/ngx-formly/ngx-formly/commit/0beaaefda380a2fe5214d43d05a5d06a624114d0))
* **core:** skip emitting modelChange on inputs changes ([414cda3](https://github.com/ngx-formly/ngx-formly/commit/414cda3f2c85526bc0a4ff02783972ca57fe1875))
* **material:** removed double tag closing in datepicker type ([#2327](https://github.com/ngx-formly/ngx-formly/issues/2327)) ([153a596](https://github.com/ngx-formly/ngx-formly/commit/153a596915695225a881531b62a11abf505787e2))

<a name="5.10.24"></a>
## [5.10.24](https://github.com/ngx-formly/ngx-formly/compare/v5.10.23...v5.10.24) (2021-11-30)


### Bug Fixes

* **core:** remove className when lazyRender is enable ([#3060](https://github.com/ngx-formly/ngx-formly/issues/3060)) ([b0d612a](https://github.com/ngx-formly/ngx-formly/commit/b0d612a)), closes [#3043](https://github.com/ngx-formly/ngx-formly/issues/3043) [#3024](https://github.com/ngx-formly/ngx-formly/issues/3024)



<a name="5.10.23"></a>
## [5.10.23](https://github.com/ngx-formly/ngx-formly/compare/v5.10.22...v5.10.23) (2021-09-22)


### Bug Fixes

* **core:** improve handling fields changes while building ([#2972](https://github.com/ngx-formly/ngx-formly/issues/2972)) ([a27e031](https://github.com/ngx-formly/ngx-formly/commit/a27e031)), closes [#2818](https://github.com/ngx-formly/ngx-formly/issues/2818)
* **core:** re-check expression when detecting new field changes ([#2973](https://github.com/ngx-formly/ngx-formly/issues/2973)) ([7209e0e](https://github.com/ngx-formly/ngx-formly/commit/7209e0e)), closes [#2167](https://github.com/ngx-formly/ngx-formly/issues/2167) [#2966](https://github.com/ngx-formly/ngx-formly/issues/2966)
* **json-schema:** add removable prop to array tuples ([#2976](https://github.com/ngx-formly/ngx-formly/issues/2976)) ([5b59bcb](https://github.com/ngx-formly/ngx-formly/commit/5b59bcb)), closes [#2862](https://github.com/ngx-formly/ngx-formly/issues/2862)
* **kendo:** support rows and cols in text-area ([#2974](https://github.com/ngx-formly/ngx-formly/issues/2974)) ([370993b](https://github.com/ngx-formly/ngx-formly/commit/370993b)), closes [#2963](https://github.com/ngx-formly/ngx-formly/issues/2963)



<a name="5.10.22"></a>
## [5.10.22](https://github.com/ngx-formly/ngx-formly/compare/v5.10.21...v5.10.22) (2021-07-10)


### Bug Fixes

* **core:** allow overriding the default build-in html attributes ([#2915](https://github.com/ngx-formly/ngx-formly/issues/2915)) ([a20df51](https://github.com/ngx-formly/ngx-formly/commit/a20df51)), closes [#2908](https://github.com/ngx-formly/ngx-formly/issues/2908)
* **core:** improve parse array notation in expression property ([#2924](https://github.com/ngx-formly/ngx-formly/issues/2924)) ([05d714f](https://github.com/ngx-formly/ngx-formly/commit/05d714f)), closes [#2916](https://github.com/ngx-formly/ngx-formly/issues/2916)
* **core:** improve stream source comparison of expressionProperties ([#2923](https://github.com/ngx-formly/ngx-formly/issues/2923)) ([ce1ca29](https://github.com/ngx-formly/ngx-formly/commit/ce1ca29)), closes [#2922](https://github.com/ngx-formly/ngx-formly/issues/2922)
* **core:** set aria-hidden to required marker ([#2913](https://github.com/ngx-formly/ngx-formly/issues/2913)) ([2d70d9f](https://github.com/ngx-formly/ngx-formly/commit/2d70d9f)), closes [#2887](https://github.com/ngx-formly/ngx-formly/issues/2887)
* **core:** take account of previously disabled control ([#2910](https://github.com/ngx-formly/ngx-formly/issues/2910)) ([65c8a95](https://github.com/ngx-formly/ngx-formly/commit/65c8a95)), closes [#2907](https://github.com/ngx-formly/ngx-formly/issues/2907)
* **json-schema:** handle array type without items keyword ([#2914](https://github.com/ngx-formly/ngx-formly/issues/2914)) ([6cb40ec](https://github.com/ngx-formly/ngx-formly/commit/6cb40ec)), closes [#2884](https://github.com/ngx-formly/ngx-formly/issues/2884)
* **json-schema:** take account of empty model in required expr ([#2904](https://github.com/ngx-formly/ngx-formly/issues/2904)) ([22451d9](https://github.com/ngx-formly/ngx-formly/commit/22451d9)), closes [#2898](https://github.com/ngx-formly/ngx-formly/issues/2898)
* **material:** support passing long error message ([#2912](https://github.com/ngx-formly/ngx-formly/issues/2912)) ([32fac5b](https://github.com/ngx-formly/ngx-formly/commit/32fac5b)), closes [#2892](https://github.com/ngx-formly/ngx-formly/issues/2892)



<a name="5.10.21"></a>
## [5.10.21](https://github.com/ngx-formly/ngx-formly/compare/v5.10.20...v5.10.21) (2021-06-01)


### Bug Fixes

* **json-schema:** improve validation of multipleOf with decimal numbers ([#2869](https://github.com/ngx-formly/ngx-formly/issues/2869)) ([faece37](https://github.com/ngx-formly/ngx-formly/commit/faece37)), closes [#2863](https://github.com/ngx-formly/ngx-formly/issues/2863)
* **json-schema:** support passing widget with $ref definition ([#2870](https://github.com/ngx-formly/ngx-formly/issues/2870)) ([fee312d](https://github.com/ngx-formly/ngx-formly/commit/fee312d)), closes [#2865](https://github.com/ngx-formly/ngx-formly/issues/2865)



<a name="5.10.20"></a>
## [5.10.20](https://github.com/ngx-formly/ngx-formly/compare/v5.10.19...v5.10.20) (2021-05-23)


### Bug Fixes

* **core:** detect form validation changes on build ([#2856](https://github.com/ngx-formly/ngx-formly/issues/2856)) ([c9c26f4](https://github.com/ngx-formly/ngx-formly/commit/c9c26f4)), closes [#2843](https://github.com/ngx-formly/ngx-formly/issues/2843)
* **core:** prevent unnecessary wrapper re-render ([#2855](https://github.com/ngx-formly/ngx-formly/issues/2855)) ([b26d64f](https://github.com/ngx-formly/ngx-formly/commit/b26d64f)), closes [#2847](https://github.com/ngx-formly/ngx-formly/issues/2847)
* **core:** support Set/Map in immutable mode ([#2852](https://github.com/ngx-formly/ngx-formly/issues/2852)) ([4d688fe](https://github.com/ngx-formly/ngx-formly/commit/4d688fe)), closes [#2848](https://github.com/ngx-formly/ngx-formly/issues/2848)
* **core:** take account of previously disabled control ([#2857](https://github.com/ngx-formly/ngx-formly/issues/2857)) ([84f47e5](https://github.com/ngx-formly/ngx-formly/commit/84f47e5)), closes [#2829](https://github.com/ngx-formly/ngx-formly/issues/2829)
* **json-schema:** detect change of multischema ([#2858](https://github.com/ngx-formly/ngx-formly/issues/2858)) ([2296330](https://github.com/ngx-formly/ngx-formly/commit/2296330)), closes [#2815](https://github.com/ngx-formly/ngx-formly/issues/2815)
* **json-schema:** do not replace expression properties if required fi… ([#2839](https://github.com/ngx-formly/ngx-formly/issues/2839)) ([56ee55c](https://github.com/ngx-formly/ngx-formly/commit/56ee55c))
* **json-schema:** take account of multischema required prop ([#2845](https://github.com/ngx-formly/ngx-formly/issues/2845)) ([b9bb77f](https://github.com/ngx-formly/ngx-formly/commit/b9bb77f)), closes [#2831](https://github.com/ngx-formly/ngx-formly/issues/2831)
* **material:** use ViewChild static query for checkbox ([#2844](https://github.com/ngx-formly/ngx-formly/issues/2844)) ([fd52a4c](https://github.com/ngx-formly/ngx-formly/commit/fd52a4c)), closes [#2838](https://github.com/ngx-formly/ngx-formly/issues/2838)



<a name="5.10.19"></a>
## [5.10.19](https://github.com/ngx-formly/ngx-formly/compare/v5.10.18...v5.10.19) (2021-05-05)


### Bug Fixes

* **core:** ensure validators key is defined on build ([#2820](https://github.com/ngx-formly/ngx-formly/issues/2820)) ([51300c8](https://github.com/ngx-formly/ngx-formly/commit/51300c8)), closes [#2818](https://github.com/ngx-formly/ngx-formly/issues/2818)
* **json-schema:** do not override widget.formlyConfig.key ([#2807](https://github.com/ngx-formly/ngx-formly/issues/2807)) ([69140f0](https://github.com/ngx-formly/ngx-formly/commit/69140f0))
* **json-schema:** resolve recursive schema when using widget ([#2827](https://github.com/ngx-formly/ngx-formly/issues/2827)) ([055c268](https://github.com/ngx-formly/ngx-formly/commit/055c268)), closes [#2823](https://github.com/ngx-formly/ngx-formly/issues/2823)
* **json-schema:** take account of optional object with required props ([#2817](https://github.com/ngx-formly/ngx-formly/issues/2817)) ([6a97932](https://github.com/ngx-formly/ngx-formly/commit/6a97932)), closes [#2752](https://github.com/ngx-formly/ngx-formly/issues/2752)
* **material:** allow passing aria-label to mat-select ([#2828](https://github.com/ngx-formly/ngx-formly/issues/2828)) ([f26d7e2](https://github.com/ngx-formly/ngx-formly/commit/f26d7e2)), closes [#2821](https://github.com/ngx-formly/ngx-formly/issues/2821)



<a name="5.10.18"></a>
## [5.10.18](https://github.com/ngx-formly/ngx-formly/compare/v5.10.17...v5.10.18) (2021-04-17)


### Bug Fixes

* **json-schema:** select all populated anyOf schemas ([#2804](https://github.com/ngx-formly/ngx-formly/issues/2804)) ([43aa184](https://github.com/ngx-formly/ngx-formly/commit/43aa184)), closes [#2802](https://github.com/ngx-formly/ngx-formly/issues/2802)
* **material:** mark as dirty on selectAll options ([#2805](https://github.com/ngx-formly/ngx-formly/issues/2805)) ([a9c5b0f](https://github.com/ngx-formly/ngx-formly/commit/a9c5b0f)), closes [#2800](https://github.com/ngx-formly/ngx-formly/issues/2800)



<a name="5.10.17"></a>
## [5.10.17](https://github.com/ngx-formly/ngx-formly/compare/v5.10.16...v5.10.17) (2021-04-09)


### Bug Fixes

* **schematics:** handle not found project ([af27dee](https://github.com/ngx-formly/ngx-formly/commit/af27dee))



<a name="5.10.16"></a>
## [5.10.16](https://github.com/ngx-formly/ngx-formly/compare/v5.10.15...v5.10.16) (2021-04-09)


### Bug Fixes

* **core:** preserve validation cache for detached fields ([#2794](https://github.com/ngx-formly/ngx-formly/issues/2794)) ([896c965](https://github.com/ngx-formly/ngx-formly/commit/896c965)), closes [#2786](https://github.com/ngx-formly/ngx-formly/issues/2786)
* **json-schema:** remove console ([d2d8734](https://github.com/ngx-formly/ngx-formly/commit/d2d8734)), closes [#2777](https://github.com/ngx-formly/ngx-formly/issues/2777)
* **material:** allow re-use internal prefix & suffix ([#2796](https://github.com/ngx-formly/ngx-formly/issues/2796)) ([bb9df21](https://github.com/ngx-formly/ngx-formly/commit/bb9df21)), closes [#2775](https://github.com/ngx-formly/ngx-formly/issues/2775)
* **schematics:** allow passing --project option to ng-add ([#2793](https://github.com/ngx-formly/ngx-formly/issues/2793)) ([5f11350](https://github.com/ngx-formly/ngx-formly/commit/5f11350)), closes [#2791](https://github.com/ngx-formly/ngx-formly/issues/2791)
* clean dist folder on build ([#2792](https://github.com/ngx-formly/ngx-formly/issues/2792)) ([99cd35c](https://github.com/ngx-formly/ngx-formly/commit/99cd35c))
* **schematics:** move to dev dependencies ([#2753](https://github.com/ngx-formly/ngx-formly/issues/2753)) ([9ef4f38](https://github.com/ngx-formly/ngx-formly/commit/9ef4f38))



<a name="5.10.15"></a>
## [5.10.15](https://github.com/ngx-formly/ngx-formly/compare/v5.10.14...v5.10.15) (2021-03-16)


### Bug Fixes

* **schematics:** restrict angular dependencies ([5b18126](https://github.com/ngx-formly/ngx-formly/commit/5b18126)), closes [#2701](https://github.com/ngx-formly/ngx-formly/issues/2701)



<a name="5.10.14"></a>
## [5.10.14](https://github.com/ngx-formly/ngx-formly/compare/v5.10.13...v5.10.14) (2021-02-13)


### Bug Fixes

* **core:** ignore whitespaces for content projection check ([#2703](https://github.com/ngx-formly/ngx-formly/issues/2703)) ([41922fb](https://github.com/ngx-formly/ngx-formly/commit/41922fb)), closes [#2692](https://github.com/ngx-formly/ngx-formly/issues/2692)
* **schematics:** add support for Angular 11.1 ([#2702](https://github.com/ngx-formly/ngx-formly/issues/2702)) ([517e176](https://github.com/ngx-formly/ngx-formly/commit/517e176)), closes [#2701](https://github.com/ngx-formly/ngx-formly/issues/2701)



<a name="5.10.13"></a>
## [5.10.13](https://github.com/ngx-formly/ngx-formly/compare/v5.10.12...v5.10.13) (2021-01-31)


### Bug Fixes

* **core:** detect mutable value changes ([#2686](https://github.com/ngx-formly/ngx-formly/issues/2686)) ([d51cf6c](https://github.com/ngx-formly/ngx-formly/commit/d51cf6c)), closes [#2684](https://github.com/ngx-formly/ngx-formly/issues/2684)
* **core:** emit statusChange on field hide ([#2687](https://github.com/ngx-formly/ngx-formly/issues/2687)) ([05278ff](https://github.com/ngx-formly/ngx-formly/commit/05278ff)), closes [#2658](https://github.com/ngx-formly/ngx-formly/issues/2658)
* **core:** make FieldArray compatible with Angular 11 ([#2685](https://github.com/ngx-formly/ngx-formly/issues/2685)) ([1c0f537](https://github.com/ngx-formly/ngx-formly/commit/1c0f537)), closes [#2674](https://github.com/ngx-formly/ngx-formly/issues/2674)



<a name="5.10.12"></a>
## [5.10.12](https://github.com/ngx-formly/ngx-formly/compare/v5.10.11...v5.10.12) (2021-01-23)


### Bug Fixes

* **core:** skip merge wrappers when explicitly set ([#2673](https://github.com/ngx-formly/ngx-formly/issues/2673)) ([13f7f72](https://github.com/ngx-formly/ngx-formly/commit/13f7f72)), closes [#2665](https://github.com/ngx-formly/ngx-formly/issues/2665)
* **ionic:** add alternative way to specify min/max date ([#2677](https://github.com/ngx-formly/ngx-formly/issues/2677)) ([de2f359](https://github.com/ngx-formly/ngx-formly/commit/de2f359)), closes [#2666](https://github.com/ngx-formly/ngx-formly/issues/2666)
* **json-schema:** avoid calling map twice ([#2675](https://github.com/ngx-formly/ngx-formly/issues/2675)) ([7f83787](https://github.com/ngx-formly/ngx-formly/commit/7f83787)), closes [#2667](https://github.com/ngx-formly/ngx-formly/issues/2667)
* **json-schema:** support readOnly for oneOf/AnyOf schema ([#2676](https://github.com/ngx-formly/ngx-formly/issues/2676)) ([17ccdf1](https://github.com/ngx-formly/ngx-formly/commit/17ccdf1)), closes [#2656](https://github.com/ngx-formly/ngx-formly/issues/2656)
* **json-schema:** use disabled for readOnly option ([#2660](https://github.com/ngx-formly/ngx-formly/issues/2660)) ([ce1be94](https://github.com/ngx-formly/ngx-formly/commit/ce1be94)), closes [#2652](https://github.com/ngx-formly/ngx-formly/issues/2652)



<a name="5.10.11"></a>
## [5.10.11](https://github.com/ngx-formly/ngx-formly/compare/v5.10.10...v5.10.11) (2021-01-02)


### Bug Fixes

* **core:** always run first core extensions ([#2647](https://github.com/ngx-formly/ngx-formly/issues/2647)) ([4975544](https://github.com/ngx-formly/ngx-formly/commit/4975544)), closes [#2637](https://github.com/ngx-formly/ngx-formly/issues/2637)
* **ionic:** apply full width for select floating position ([#2645](https://github.com/ngx-formly/ngx-formly/issues/2645)) ([9b58116](https://github.com/ngx-formly/ngx-formly/commit/9b58116)), closes [#2635](https://github.com/ngx-formly/ngx-formly/issues/2635)



<a name="5.10.10"></a>
## [5.10.10](https://github.com/ngx-formly/ngx-formly/compare/v5.10.9...v5.10.10) (2020-12-20)


### Bug Fixes

* **core:** take account of default value on resetModel ([#2632](https://github.com/ngx-formly/ngx-formly/issues/2632)) ([d1f8f43](https://github.com/ngx-formly/ngx-formly/commit/d1f8f43)), closes [#2621](https://github.com/ngx-formly/ngx-formly/issues/2621)



<a name="5.10.9"></a>
## [5.10.9](https://github.com/ngx-formly/ngx-formly/compare/v5.10.8...v5.10.9) (2020-12-14)


### Reverts

* **core:** take account of parent disable state on init ([0e0980a](https://github.com/ngx-formly/ngx-formly/commit/0e0980a)), closes [#2624](https://github.com/ngx-formly/ngx-formly/issues/2624)



<a name="5.10.8"></a>
## [5.10.8](https://github.com/ngx-formly/ngx-formly/compare/v5.10.7...v5.10.8) (2020-12-11)


### Bug Fixes

* **core:** allow control resetOnHide for a specific field ([#2619](https://github.com/ngx-formly/ngx-formly/issues/2619)) ([f51a9df](https://github.com/ngx-formly/ngx-formly/commit/f51a9df)), closes [#2570](https://github.com/ngx-formly/ngx-formly/issues/2570)
* **material:** handle checkbox destroy ([#2618](https://github.com/ngx-formly/ngx-formly/issues/2618)) ([ddb26a7](https://github.com/ngx-formly/ngx-formly/commit/ddb26a7)), closes [#2602](https://github.com/ngx-formly/ngx-formly/issues/2602)



<a name="5.10.7"></a>
## [5.10.7](https://github.com/ngx-formly/ngx-formly/compare/v5.10.6...v5.10.7) (2020-12-08)


### Bug Fixes

* **core:** detect disabled state for CD OnPush components ([#2612](https://github.com/ngx-formly/ngx-formly/issues/2612)) ([81038e2](https://github.com/ngx-formly/ngx-formly/commit/81038e2)), closes [#2588](https://github.com/ngx-formly/ngx-formly/issues/2588)
* **core:** take account of parent disable state on init ([#2610](https://github.com/ngx-formly/ngx-formly/issues/2610)) ([22ff9ca](https://github.com/ngx-formly/ngx-formly/commit/22ff9ca)), closes [#2598](https://github.com/ngx-formly/ngx-formly/issues/2598)
* **material:** assign disable state to datepicker-toggle ([#2613](https://github.com/ngx-formly/ngx-formly/issues/2613)) ([f0284f3](https://github.com/ngx-formly/ngx-formly/commit/f0284f3)), closes [#2221](https://github.com/ngx-formly/ngx-formly/issues/2221)
* **material:** trigger focus/blur event for mat-checkbox ([#2611](https://github.com/ngx-formly/ngx-formly/issues/2611)) ([81f523f](https://github.com/ngx-formly/ngx-formly/commit/81f523f)), closes [#2602](https://github.com/ngx-formly/ngx-formly/issues/2602)



<a name="5.10.6"></a>
## [5.10.6](https://github.com/ngx-formly/ngx-formly/compare/v5.10.5...v5.10.6) (2020-10-31)


### Bug Fixes

* **core:** apply default value on hide changes for nested object ([#2578](https://github.com/ngx-formly/ngx-formly/issues/2578)) ([b2d4951](https://github.com/ngx-formly/ngx-formly/commit/b2d4951)), closes [#2569](https://github.com/ngx-formly/ngx-formly/issues/2569)
* **ionic:** add v5 to peer dependencies ([#2576](https://github.com/ngx-formly/ngx-formly/issues/2576)) ([037f13d](https://github.com/ngx-formly/ngx-formly/commit/037f13d)), closes [#2575](https://github.com/ngx-formly/ngx-formly/issues/2575)
* **material:** ignore disabled option on selectAll ([#2577](https://github.com/ngx-formly/ngx-formly/issues/2577)) ([8744c11](https://github.com/ngx-formly/ngx-formly/commit/8744c11)), closes [#2568](https://github.com/ngx-formly/ngx-formly/issues/2568)



<a name="5.10.5"></a>
## [5.10.5](https://github.com/ngx-formly/ngx-formly/compare/v5.10.4...v5.10.5) (2020-10-25)


### Bug Fixes

* **core:** avoid creation a dummy field for nested key ([#2560](https://github.com/ngx-formly/ngx-formly/issues/2560)) ([0b9caa4](https://github.com/ngx-formly/ngx-formly/commit/0b9caa4)), closes [#2547](https://github.com/ngx-formly/ngx-formly/issues/2547)
* **core:** avoid overriding accessor by property ([#2559](https://github.com/ngx-formly/ngx-formly/issues/2559)) ([deefd4e](https://github.com/ngx-formly/ngx-formly/commit/deefd4e)), closes [#2552](https://github.com/ngx-formly/ngx-formly/issues/2552)
* **material:** prevent scroll on focus for radio and checkbox ([#2562](https://github.com/ngx-formly/ngx-formly/issues/2562)) ([fd0ccd2](https://github.com/ngx-formly/ngx-formly/commit/fd0ccd2))



<a name="5.10.4"></a>
## [5.10.4](https://github.com/ngx-formly/ngx-formly/compare/v5.10.3...v5.10.4) (2020-10-17)


### Bug Fixes

* **core:** assign validator for field with empty key ([#2544](https://github.com/ngx-formly/ngx-formly/issues/2544)) ([116e454](https://github.com/ngx-formly/ngx-formly/commit/116e454))
* support disable a specific select/radio option ([#2543](https://github.com/ngx-formly/ngx-formly/issues/2543)) ([6159cb0](https://github.com/ngx-formly/ngx-formly/commit/6159cb0)), closes [#2532](https://github.com/ngx-formly/ngx-formly/issues/2532)



<a name="5.10.3"></a>
## [5.10.3](https://github.com/ngx-formly/ngx-formly/compare/v5.10.2...v5.10.3) (2020-10-03)


### Bug Fixes

* **core:** clear validation cache on fields input change ([#2527](https://github.com/ngx-formly/ngx-formly/issues/2527)) ([5ef8c67](https://github.com/ngx-formly/ngx-formly/commit/5ef8c67)), closes [#2524](https://github.com/ngx-formly/ngx-formly/issues/2524)
* **core:** supports array notation in expression property ([#2526](https://github.com/ngx-formly/ngx-formly/issues/2526)) ([485bc32](https://github.com/ngx-formly/ngx-formly/commit/485bc32)), closes [#2525](https://github.com/ngx-formly/ngx-formly/issues/2525)



<a name="5.10.2"></a>
## [5.10.2](https://github.com/ngx-formly/ngx-formly/compare/v5.10.1...v5.10.2) (2020-09-26)


### Bug Fixes

* **core:** clear value on hide for array type ([#2522](https://github.com/ngx-formly/ngx-formly/issues/2522)) ([49b3775](https://github.com/ngx-formly/ngx-formly/commit/49b3775)), closes [#2480](https://github.com/ngx-formly/ngx-formly/issues/2480)
* **core:** improve expression error message ([#2521](https://github.com/ngx-formly/ngx-formly/issues/2521)) ([a8fe97d](https://github.com/ngx-formly/ngx-formly/commit/a8fe97d)), closes [#2492](https://github.com/ngx-formly/ngx-formly/issues/2492)
* **core:** move eval expression to post populate ([#2516](https://github.com/ngx-formly/ngx-formly/issues/2516)) ([e1e7598](https://github.com/ngx-formly/ngx-formly/commit/e1e7598)), closes [#2515](https://github.com/ngx-formly/ngx-formly/issues/2515)
* **core:** rely on internal model when model input is empty ([#2520](https://github.com/ngx-formly/ngx-formly/issues/2520)) ([efe68f9](https://github.com/ngx-formly/ngx-formly/commit/efe68f9)), closes [#2493](https://github.com/ngx-formly/ngx-formly/issues/2493)
* **core:** remove parent check on assign nullable value ([#2518](https://github.com/ngx-formly/ngx-formly/issues/2518)) ([ab26e3b](https://github.com/ngx-formly/ngx-formly/commit/ab26e3b)), closes [#2491](https://github.com/ngx-formly/ngx-formly/issues/2491)
* **material:** delay radio focus on status changes ([#2519](https://github.com/ngx-formly/ngx-formly/issues/2519)) ([a430b3b](https://github.com/ngx-formly/ngx-formly/commit/a430b3b)), closes [#2498](https://github.com/ngx-formly/ngx-formly/issues/2498)
* **material:** rely on tabIndex input instead of attr ([#2517](https://github.com/ngx-formly/ngx-formly/issues/2517)) ([110efee](https://github.com/ngx-formly/ngx-formly/commit/110efee)), closes [#2501](https://github.com/ngx-formly/ngx-formly/issues/2501)



<a name="5.10.1"></a>
## [5.10.1](https://github.com/ngx-formly/ngx-formly/compare/v5.10.0...v5.10.1) (2020-09-04)


### Bug Fixes

* **core:** apply defaultValue for array when resetFieldOnHide enabled ([#2488](https://github.com/ngx-formly/ngx-formly/issues/2488)) ([4049e00](https://github.com/ngx-formly/ngx-formly/commit/4049e00))



<a name="5.10.0"></a>
# [5.10.0](https://github.com/ngx-formly/ngx-formly/compare/v5.9.3...v5.10.0) (2020-08-30)


### Bug Fixes

* **core:** avoid memory leakes for internal componentRefs ([#2474](https://github.com/ngx-formly/ngx-formly/issues/2474)) ([e3d29e5](https://github.com/ngx-formly/ngx-formly/commit/e3d29e5))
* **core:** share formControl for array field when key is duplicated ([#2422](https://github.com/ngx-formly/ngx-formly/issues/2422)) ([8e461f4](https://github.com/ngx-formly/ngx-formly/commit/8e461f4)), closes [#2420](https://github.com/ngx-formly/ngx-formly/issues/2420)
* **json-schema:** avoid rely on default value for select oneOf item ([#2431](https://github.com/ngx-formly/ngx-formly/issues/2431)) ([1c182bf](https://github.com/ngx-formly/ngx-formly/commit/1c182bf)), closes [#2429](https://github.com/ngx-formly/ngx-formly/issues/2429)
* **json-schema:** avoid reset on hide during the build step ([#2426](https://github.com/ngx-formly/ngx-formly/issues/2426)) ([07fb1f6](https://github.com/ngx-formly/ngx-formly/commit/07fb1f6)), closes [#2420](https://github.com/ngx-formly/ngx-formly/issues/2420)
* **json-schema:** support nested oneOf ([#2428](https://github.com/ngx-formly/ngx-formly/issues/2428)) ([085f32c](https://github.com/ngx-formly/ngx-formly/commit/085f32c)), closes [#2403](https://github.com/ngx-formly/ngx-formly/issues/2403)
* **json-schema:** take account of passing float to multipleOf validation ([#2441](https://github.com/ngx-formly/ngx-formly/issues/2441)) ([f0ba4be](https://github.com/ngx-formly/ngx-formly/commit/f0ba4be)), closes [#2435](https://github.com/ngx-formly/ngx-formly/issues/2435)
* **material:** apply a11y for validation messages ([#2464](https://github.com/ngx-formly/ngx-formly/issues/2464)) ([c35a73b](https://github.com/ngx-formly/ngx-formly/commit/c35a73b))
* **material:** remove empty mat-prefix and mat-suffix ([#2444](https://github.com/ngx-formly/ngx-formly/issues/2444)) ([108fe95](https://github.com/ngx-formly/ngx-formly/commit/108fe95)), closes [#2443](https://github.com/ngx-formly/ngx-formly/issues/2443)
* **schematics:** update angular-devkit deps ([#2413](https://github.com/ngx-formly/ngx-formly/issues/2413)) ([6e232e1](https://github.com/ngx-formly/ngx-formly/commit/6e232e1))


### Features

* **core:** add option to resetFieldOnHide ([#2476](https://github.com/ngx-formly/ngx-formly/issues/2476)) ([fff80de](https://github.com/ngx-formly/ngx-formly/commit/fff80de)), closes [#1847](https://github.com/ngx-formly/ngx-formly/issues/1847) [#2381](https://github.com/ngx-formly/ngx-formly/issues/2381) [#2439](https://github.com/ngx-formly/ngx-formly/issues/2439)
* **core:** allow passing observable for expression asyncValidators ([#2440](https://github.com/ngx-formly/ngx-formly/issues/2440)) ([dbbca7f](https://github.com/ngx-formly/ngx-formly/commit/dbbca7f))
* **core:** lazily render component field type ([#2416](https://github.com/ngx-formly/ngx-formly/issues/2416)) ([429b3ec](https://github.com/ngx-formly/ngx-formly/commit/429b3ec)), closes [#1215](https://github.com/ngx-formly/ngx-formly/issues/1215)
* **core:** support form control for field with empty key ([#2404](https://github.com/ngx-formly/ngx-formly/issues/2404)) ([3b47e0e](https://github.com/ngx-formly/ngx-formly/commit/3b47e0e)), closes [#2403](https://github.com/ngx-formly/ngx-formly/issues/2403)
* **core:** support multiple errors from a single validator ([#2392](https://github.com/ngx-formly/ngx-formly/issues/2392)) ([d12be59](https://github.com/ngx-formly/ngx-formly/commit/d12be59)), closes [#2378](https://github.com/ngx-formly/ngx-formly/issues/2378)
* **json-schema:** allow passing mixed type in oneOf ([#2425](https://github.com/ngx-formly/ngx-formly/issues/2425)) ([ce47591](https://github.com/ngx-formly/ngx-formly/commit/ce47591)), closes [#2420](https://github.com/ngx-formly/ngx-formly/issues/2420)
* **material:** allow disable a single radio button ([391257c](https://github.com/ngx-formly/ngx-formly/commit/391257c))



<a name="5.9.3"></a>
## [5.9.3](https://github.com/ngx-formly/ngx-formly/compare/v5.9.2...v5.9.3) (2020-07-26)


### Bug Fixes

* **core:** revert change event to host ([#2397](https://github.com/ngx-formly/ngx-formly/issues/2397)) ([b4d50d9](https://github.com/ngx-formly/ngx-formly/commit/b4d50d9)), closes [#2390](https://github.com/ngx-formly/ngx-formly/issues/2390)
* **json-schema:** support oneOf with $ref definition ([#2396](https://github.com/ngx-formly/ngx-formly/issues/2396)) ([d027020](https://github.com/ngx-formly/ngx-formly/commit/d027020)), closes [#2394](https://github.com/ngx-formly/ngx-formly/issues/2394)



<a name="5.9.2"></a>
## [5.9.2](https://github.com/ngx-formly/ngx-formly/compare/v5.9.1...v5.9.2) (2020-07-24)


### Bug Fixes

* **core:** pass a valid event instance for change fn ([#2391](https://github.com/ngx-formly/ngx-formly/issues/2391)) ([49daa5a](https://github.com/ngx-formly/ngx-formly/commit/49daa5a)), closes [#2390](https://github.com/ngx-formly/ngx-formly/issues/2390)



<a name="5.9.1"></a>
## [5.9.1](https://github.com/ngx-formly/ngx-formly/compare/v5.9.0...v5.9.1) (2020-07-20)


### Bug Fixes

* **core:** avoid re-parse nested field key ([#2367](https://github.com/ngx-formly/ngx-formly/issues/2367)) ([7464955](https://github.com/ngx-formly/ngx-formly/commit/7464955)), closes [#2344](https://github.com/ngx-formly/ngx-formly/issues/2344)
* **core:** take account of async validators errorPath ([#2377](https://github.com/ngx-formly/ngx-formly/issues/2377)) ([62c731c](https://github.com/ngx-formly/ngx-formly/commit/62c731c)), closes [#2373](https://github.com/ngx-formly/ngx-formly/issues/2373)
* **json-schema:** manage oneOf of duplicated field property ([#2376](https://github.com/ngx-formly/ngx-formly/issues/2376)) ([66f62f8](https://github.com/ngx-formly/ngx-formly/commit/66f62f8)), closes [#2374](https://github.com/ngx-formly/ngx-formly/issues/2374)
* **material:** add change event for toggle and slider types ([#2366](https://github.com/ngx-formly/ngx-formly/issues/2366)) ([88c12e7](https://github.com/ngx-formly/ngx-formly/commit/88c12e7)), closes [#2353](https://github.com/ngx-formly/ngx-formly/issues/2353)



<a name="5.9.0"></a>
# [5.9.0](https://github.com/ngx-formly/ngx-formly/compare/v5.8.0...v5.9.0) (2020-07-14)


### Bug Fixes

* **core:** avoid unnecessary valueChanges on add/remove field array ([#2361](https://github.com/ngx-formly/ngx-formly/issues/2361)) ([26370ce](https://github.com/ngx-formly/ngx-formly/commit/26370ce)), closes [#2355](https://github.com/ngx-formly/ngx-formly/issues/2355)
* **material:** rely on checkbox change input instead of formly attr ([#2356](https://github.com/ngx-formly/ngx-formly/issues/2356)) ([eaa66ed](https://github.com/ngx-formly/ngx-formly/commit/eaa66ed)), closes [#2353](https://github.com/ngx-formly/ngx-formly/issues/2353)
* **material:** revert required behavior for checkbox ([#2358](https://github.com/ngx-formly/ngx-formly/issues/2358)) ([3c08c38](https://github.com/ngx-formly/ngx-formly/commit/3c08c38)), closes [#2349](https://github.com/ngx-formly/ngx-formly/issues/2349)
* **schematics:** include ng-zorro-antd in uiTheme schema.json ([ffad0db](https://github.com/ngx-formly/ngx-formly/commit/ffad0db)), closes [#2333](https://github.com/ngx-formly/ngx-formly/issues/2333)


### Features

* **core:** allow passing number or array to field key ([#2359](https://github.com/ngx-formly/ngx-formly/issues/2359)) ([edf7f27](https://github.com/ngx-formly/ngx-formly/commit/edf7f27)), closes [#2344](https://github.com/ngx-formly/ngx-formly/issues/2344)
* **core:** emit expressionChanges event through fieldChanges option ([#2357](https://github.com/ngx-formly/ngx-formly/issues/2357)) ([5d19b9f](https://github.com/ngx-formly/ngx-formly/commit/5d19b9f)), closes [#2350](https://github.com/ngx-formly/ngx-formly/issues/2350)



<a name="5.8.0"></a>
# [5.8.0](https://github.com/ngx-formly/ngx-formly/compare/v5.7.2...v5.8.0) (2020-06-29)


### Bug Fixes

* **core:** ensure change event is called after the formControl change ([#2336](https://github.com/ngx-formly/ngx-formly/issues/2336)) ([051480d](https://github.com/ngx-formly/ngx-formly/commit/051480d)), closes [#2324](https://github.com/ngx-formly/ngx-formly/issues/2324)
* **schematics:** add ng-zorro-antd to ui-theme option ([#2337](https://github.com/ngx-formly/ngx-formly/issues/2337)) ([e2274a7](https://github.com/ngx-formly/ngx-formly/commit/e2274a7)), closes [#2333](https://github.com/ngx-formly/ngx-formly/issues/2333)


### Features

* **bootstrap:** support checkbox without label ([#2339](https://github.com/ngx-formly/ngx-formly/issues/2339)) ([989dec0](https://github.com/ngx-formly/ngx-formly/commit/989dec0)), closes [#2313](https://github.com/ngx-formly/ngx-formly/issues/2313)
* **core:** support attach error to specific field from a validator ([#2342](https://github.com/ngx-formly/ngx-formly/issues/2342)) ([d8b612d](https://github.com/ngx-formly/ngx-formly/commit/d8b612d)), closes [#2332](https://github.com/ngx-formly/ngx-formly/issues/2332)
* **ionic:** add Names && ShortNames inputs for datetime picker ([#2338](https://github.com/ngx-formly/ngx-formly/issues/2338)) ([2e74cb3](https://github.com/ngx-formly/ngx-formly/commit/2e74cb3)), closes [#2331](https://github.com/ngx-formly/ngx-formly/issues/2331)
* **material:** add monthSelected && yearSelected outputs for datepicker ([#2340](https://github.com/ngx-formly/ngx-formly/issues/2340)) ([f1f0cc9](https://github.com/ngx-formly/ngx-formly/commit/f1f0cc9)), closes [#2308](https://github.com/ngx-formly/ngx-formly/issues/2308)



<a name="5.7.2"></a>
## [5.7.2](https://github.com/ngx-formly/ngx-formly/compare/v5.7.1...v5.7.2) (2020-06-20)


### Bug Fixes

* **core:** allow Observable for `validation.messages` property ([#2297](https://github.com/ngx-formly/ngx-formly/issues/2297)) ([af6ecf8](https://github.com/ngx-formly/ngx-formly/commit/af6ecf8))
* **core:** provide more details on missing type declaration ([#2320](https://github.com/ngx-formly/ngx-formly/issues/2320)) ([c98b242](https://github.com/ngx-formly/ngx-formly/commit/c98b242)), closes [#2305](https://github.com/ngx-formly/ngx-formly/issues/2305)
* **material:** use false for input static query ([#2319](https://github.com/ngx-formly/ngx-formly/issues/2319)) ([cd53629](https://github.com/ngx-formly/ngx-formly/commit/cd53629)), closes [#2314](https://github.com/ngx-formly/ngx-formly/issues/2314)



## [5.7.1](https://github.com/ngx-formly/ngx-formly/compare/v5.7.0...v5.7.1) (2020-06-03)


### Bug Fixes

* **core:** keep the model in-sync with the root field ([#2296](https://github.com/ngx-formly/ngx-formly/issues/2296)) ([b645a77](https://github.com/ngx-formly/ngx-formly/commit/b645a7731813af0a3c72d45c63829e68a4ead1fd)), closes [#2294](https://github.com/ngx-formly/ngx-formly/issues/2294)

<a name="5.7.0"></a>
# [5.7.0](https://github.com/ngx-formly/ngx-formly/compare/v5.6.2...v5.7.0) (2020-06-01)


### Bug Fixes

* **schematics:** rely sourceRoot to get the project path ([#2292](https://github.com/ngx-formly/ngx-formly/issues/2292)) ([46885e9](https://github.com/ngx-formly/ngx-formly/commit/46885e9)), closes [#2291](https://github.com/ngx-formly/ngx-formly/issues/2291)


### Features

* **bootstrap:** support switch style checkboxes ([#2263](https://github.com/ngx-formly/ngx-formly/issues/2263)) ([5b1a771](https://github.com/ngx-formly/ngx-formly/commit/5b1a771)), closes [#2257](https://github.com/ngx-formly/ngx-formly/issues/2257)
* **core:** add an alternative way for passing parameters to validation ([#2269](https://github.com/ngx-formly/ngx-formly/issues/2269)) ([0295bd9](https://github.com/ngx-formly/ngx-formly/commit/0295bd9)), closes [#1828](https://github.com/ngx-formly/ngx-formly/issues/1828)
* **core:** allow nullable value for group type ([#2267](https://github.com/ngx-formly/ngx-formly/issues/2267)) ([a34d384](https://github.com/ngx-formly/ngx-formly/commit/a34d384)), closes [#2265](https://github.com/ngx-formly/ngx-formly/issues/2265)
* **core:** allow onInit/afterView/afterContent to return observables ([#2242](https://github.com/ngx-formly/ngx-formly/issues/2242)) ([f91637e](https://github.com/ngx-formly/ngx-formly/commit/f91637e)), closes [#1986](https://github.com/ngx-formly/ngx-formly/issues/1986)
* **core:** deprecate doCheck, afterContent and afterView Checked hooks ([#2245](https://github.com/ngx-formly/ngx-formly/issues/2245)) ([aea28e1](https://github.com/ngx-formly/ngx-formly/commit/aea28e1))
* **core:** support passing observable for validation message ([#2241](https://github.com/ngx-formly/ngx-formly/issues/2241)) ([a53a737](https://github.com/ngx-formly/ngx-formly/commit/a53a737)), closes [#2214](https://github.com/ngx-formly/ngx-formly/issues/2214)
* **core:** support validations for fieldGroup with empty key ([#2271](https://github.com/ngx-formly/ngx-formly/issues/2271)) ([ffe7df0](https://github.com/ngx-formly/ngx-formly/commit/ffe7df0)), closes [#2059](https://github.com/ngx-formly/ngx-formly/issues/2059) [#2255](https://github.com/ngx-formly/ngx-formly/issues/2255)
* **ionic:** add compareWith input for select type ([#2277](https://github.com/ngx-formly/ngx-formly/issues/2277)) ([7ef2b8e](https://github.com/ngx-formly/ngx-formly/commit/7ef2b8e)), closes [#2275](https://github.com/ngx-formly/ngx-formly/issues/2275)
* **material:** add missing mat-datepicker inputs to datepickerOptions ([#2274](https://github.com/ngx-formly/ngx-formly/issues/2274)) ([4003729](https://github.com/ngx-formly/ngx-formly/commit/4003729)), closes [#2221](https://github.com/ngx-formly/ngx-formly/issues/2221)



<a name="5.6.2"></a>
## [5.6.2](https://github.com/ngx-formly/ngx-formly/compare/v5.6.1...v5.6.2) (2020-05-21)


### Bug Fixes

* **material:** take account of disabled state for multicheckbox type ([#2225](https://github.com/ngx-formly/ngx-formly/issues/2225)) ([741df7a](https://github.com/ngx-formly/ngx-formly/commit/741df7a)), closes [#2224](https://github.com/ngx-formly/ngx-formly/issues/2224)
* **material:** take account of radio button focus on page load ([#2249](https://github.com/ngx-formly/ngx-formly/issues/2249)) ([35602e5](https://github.com/ngx-formly/ngx-formly/commit/35602e5)), closes [#2248](https://github.com/ngx-formly/ngx-formly/issues/2248)



<a name="5.6.1"></a>
## [5.6.1](https://github.com/ngx-formly/ngx-formly/compare/v5.6.0...v5.6.1) (2020-04-30)


### Bug Fixes

* **core:** resubscribe to expr prop when re-rendering the field ([#2216](https://github.com/ngx-formly/ngx-formly/issues/2216)) ([1269f57](https://github.com/ngx-formly/ngx-formly/commit/1269f57)), closes [#2214](https://github.com/ngx-formly/ngx-formly/issues/2214)
* **ionic:** allow async options for ion-select ([#2202](https://github.com/ngx-formly/ngx-formly/issues/2202)) ([7a3247d](https://github.com/ngx-formly/ngx-formly/commit/7a3247d))
* **material:** make sure required attribute is present in mat types ([#2213](https://github.com/ngx-formly/ngx-formly/issues/2213)) ([89ea2ac](https://github.com/ngx-formly/ngx-formly/commit/89ea2ac)), closes [#2212](https://github.com/ngx-formly/ngx-formly/issues/2212)



<a name="5.6.0"></a>
# [5.6.0](https://github.com/ngx-formly/ngx-formly/compare/v5.5.15...v5.6.0) (2020-04-22)


### Bug Fixes

* **core:** ensure field is not empty when calling hooks ([#2198](https://github.com/ngx-formly/ngx-formly/issues/2198)) ([7019161](https://github.com/ngx-formly/ngx-formly/commit/7019161)), closes [#1864](https://github.com/ngx-formly/ngx-formly/issues/1864)
* **core:** fix OnPush FieldTypes not being change detected ([#2192](https://github.com/ngx-formly/ngx-formly/issues/2192)) ([3234118](https://github.com/ngx-formly/ngx-formly/commit/3234118))
* **core:** support Content-Security-Policy header script-src 's… ([#2199](https://github.com/ngx-formly/ngx-formly/issues/2199)) ([23edc3e](https://github.com/ngx-formly/ngx-formly/commit/23edc3e)), closes [#2157](https://github.com/ngx-formly/ngx-formly/issues/2157)
* **json-schema:** take acocunt of total matched oneOf props ([#2196](https://github.com/ngx-formly/ngx-formly/issues/2196)) ([9367216](https://github.com/ngx-formly/ngx-formly/commit/9367216)), closes [#2195](https://github.com/ngx-formly/ngx-formly/issues/2195)
* **schematics:** remove comments in collection.json ([#2178](https://github.com/ngx-formly/ngx-formly/issues/2178)) ([5514f59](https://github.com/ngx-formly/ngx-formly/commit/5514f59))


### Features

* **bootstrap:** support custom-inline for radio/checkbox ([#2133](https://github.com/ngx-formly/ngx-formly/issues/2133)) ([8b46f95](https://github.com/ngx-formly/ngx-formly/commit/8b46f95)), closes [#2103](https://github.com/ngx-formly/ngx-formly/issues/2103)
* **core:** add safeHtml opt to bypass sanitizing template HTML… ([#2090](https://github.com/ngx-formly/ngx-formly/issues/2090)) ([bbd7009](https://github.com/ngx-formly/ngx-formly/commit/bbd7009)), closes [#2039](https://github.com/ngx-formly/ngx-formly/issues/2039)
* **core:** all Add/Remove field array without triggering form… ([#2087](https://github.com/ngx-formly/ngx-formly/issues/2087)) ([a96cae6](https://github.com/ngx-formly/ngx-formly/commit/a96cae6)), closes [#2044](https://github.com/ngx-formly/ngx-formly/issues/2044)
* **ionic:** add missing properties to datetime type ([#2141](https://github.com/ngx-formly/ngx-formly/issues/2141)) ([56705dc](https://github.com/ngx-formly/ngx-formly/commit/56705dc))
* **material:** add dateInput and dateChange options to datepic… ([#2132](https://github.com/ngx-formly/ngx-formly/issues/2132)) ([666e960](https://github.com/ngx-formly/ngx-formly/commit/666e960)), closes [#2127](https://github.com/ngx-formly/ngx-formly/issues/2127)
* **material:** mat-slide-toggle color support ([#2186](https://github.com/ngx-formly/ngx-formly/issues/2186)) ([3e3b121](https://github.com/ngx-formly/ngx-formly/commit/3e3b121))
* **material:** mat-slider thumbLabel support ([#2190](https://github.com/ngx-formly/ngx-formly/issues/2190)) ([6266881](https://github.com/ngx-formly/ngx-formly/commit/6266881))



<a name="5.5.15"></a>
## [5.5.15](https://github.com/ngx-formly/ngx-formly/compare/v5.5.14...v5.5.15) (2020-03-17)


### Bug Fixes

* **core:** allow using FieldArray without a key ([#2142](https://github.com/ngx-formly/ngx-formly/issues/2142)) ([32a3a9d](https://github.com/ngx-formly/ngx-formly/commit/32a3a9d))
* **core:** ensure showError option return a boolean value ([#2146](https://github.com/ngx-formly/ngx-formly/issues/2146)) ([0ed6f9a](https://github.com/ngx-formly/ngx-formly/commit/0ed6f9a)), closes [#2144](https://github.com/ngx-formly/ngx-formly/issues/2144)
* **primeng:** change class ui-messages-error to ui-message-error ([#2136](https://github.com/ngx-formly/ngx-formly/issues/2136)) ([1b41aaa](https://github.com/ngx-formly/ngx-formly/commit/1b41aaa)), closes [#2135](https://github.com/ngx-formly/ngx-formly/issues/2135)



<a name="5.5.14"></a>
## [5.5.14](https://github.com/ngx-formly/ngx-formly/compare/v5.5.13...v5.5.14) (2020-03-06)


### Bug Fixes

* **core:** allow passing a custom type when template is null ([#2126](https://github.com/ngx-formly/ngx-formly/issues/2126)) ([2129892](https://github.com/ngx-formly/ngx-formly/commit/2129892)), closes [#2121](https://github.com/ngx-formly/ngx-formly/issues/2121)
* **core:** disabled expression should not overwrites child expr… ([#2130](https://github.com/ngx-formly/ngx-formly/issues/2130)) ([f779edb](https://github.com/ngx-formly/ngx-formly/commit/f779edb)), closes [#2129](https://github.com/ngx-formly/ngx-formly/issues/2129) [#2128](https://github.com/ngx-formly/ngx-formly/issues/2128)



<a name="5.5.13"></a>
## [5.5.13](https://github.com/ngx-formly/ngx-formly/compare/v5.5.12...v5.5.13) (2020-02-20)


### Bug Fixes

* **core:** emit statusChanges on updateValueAndValidity ([#2107](https://github.com/ngx-formly/ngx-formly/issues/2107)) ([7deac1a](https://github.com/ngx-formly/ngx-formly/commit/7deac1a)), closes [#2106](https://github.com/ngx-formly/ngx-formly/issues/2106)
* **material:** handle undefined color palette for checkbox ([#2109](https://github.com/ngx-formly/ngx-formly/issues/2109)) ([8998b61](https://github.com/ngx-formly/ngx-formly/commit/8998b61)), closes [#2101](https://github.com/ngx-formly/ngx-formly/issues/2101)



<a name="5.5.12"></a>
## [5.5.12](https://github.com/ngx-formly/ngx-formly/compare/v5.5.11...v5.5.12) (2020-02-12)


### Bug Fixes

* **core:** ensure UI is in sync when using custom checkExpressi… ([#2097](https://github.com/ngx-formly/ngx-formly/issues/2097)) ([80c2f7b](https://github.com/ngx-formly/ngx-formly/commit/80c2f7b)), closes [#2095](https://github.com/ngx-formly/ngx-formly/issues/2095)
* **core:** take account of passing observable to model expr ([#2096](https://github.com/ngx-formly/ngx-formly/issues/2096)) ([4bf1445](https://github.com/ngx-formly/ngx-formly/commit/4bf1445)), closes [#2094](https://github.com/ngx-formly/ngx-formly/issues/2094)
* **core:** take account of the emitted modelChange value as mod… ([#2098](https://github.com/ngx-formly/ngx-formly/issues/2098)) ([ad99519](https://github.com/ngx-formly/ngx-formly/commit/ad99519)), closes [#2093](https://github.com/ngx-formly/ngx-formly/issues/2093)


### Performance Improvements

* **core:** reduce form _updateTreeValidity calls ([#2078](https://github.com/ngx-formly/ngx-formly/issues/2078)) ([dad2ef6](https://github.com/ngx-formly/ngx-formly/commit/dad2ef6))



<a name="5.5.11"></a>
## [5.5.11](https://github.com/ngx-formly/ngx-formly/compare/v5.5.10...v5.5.11) (2020-02-03)


### Bug Fixes

* **bootstrap:** rely on accessor to select empty option ([#2047](https://github.com/ngx-formly/ngx-formly/issues/2047)) ([890c5aa](https://github.com/ngx-formly/ngx-formly/commit/890c5aa)), closes [#2043](https://github.com/ngx-formly/ngx-formly/issues/2043)
* **core:** avoid using includes for IE compatibility ([#2062](https://github.com/ngx-formly/ngx-formly/issues/2062)) ([1f9b0ae](https://github.com/ngx-formly/ngx-formly/commit/1f9b0ae)), closes [#2058](https://github.com/ngx-formly/ngx-formly/issues/2058)
* **core:** create field type instance for each formly-field com… ([#2068](https://github.com/ngx-formly/ngx-formly/issues/2068)) ([ecc632d](https://github.com/ngx-formly/ngx-formly/commit/ecc632d)), closes [#2060](https://github.com/ngx-formly/ngx-formly/issues/2060) [#2065](https://github.com/ngx-formly/ngx-formly/issues/2065) [#2045](https://github.com/ngx-formly/ngx-formly/issues/2045)
* **core:** detach the rendered field from the destroyed wrapper… ([#2073](https://github.com/ngx-formly/ngx-formly/issues/2073)) ([cca863e](https://github.com/ngx-formly/ngx-formly/commit/cca863e))
* **core:** detect expression changes on submit ([#2046](https://github.com/ngx-formly/ngx-formly/issues/2046)) ([9947906](https://github.com/ngx-formly/ngx-formly/commit/9947906)), closes [#1845](https://github.com/ngx-formly/ngx-formly/issues/1845)
* **core:** detect observable expression changes when using OnPush CD ([#2051](https://github.com/ngx-formly/ngx-formly/issues/2051)) ([960ee42](https://github.com/ngx-formly/ngx-formly/commit/960ee42)), closes [#2050](https://github.com/ngx-formly/ngx-formly/issues/2050)
* **core:** ensure wrapProperty fn is removed after unsubscribe ([#2067](https://github.com/ngx-formly/ngx-formly/issues/2067)) ([ef77b49](https://github.com/ngx-formly/ngx-formly/commit/ef77b49)), closes [#2066](https://github.com/ngx-formly/ngx-formly/issues/2066)
* **core:** keep order of value subscriptions consistent on rebu… ([#2063](https://github.com/ngx-formly/ngx-formly/issues/2063)) ([d667122](https://github.com/ngx-formly/ngx-formly/commit/d667122)), closes [#2061](https://github.com/ngx-formly/ngx-formly/issues/2061)
* **core:** set id attr to the first formlyAttributes elements only ([ed3ea3c](https://github.com/ngx-formly/ngx-formly/commit/ed3ea3c))
* **core:** use id @Input when is set instead of field id ([dfda03b](https://github.com/ngx-formly/ngx-formly/commit/dfda03b)), closes [#2071](https://github.com/ngx-formly/ngx-formly/issues/2071)
* **material:** remove textarea autosize attributes when disabled ([#2052](https://github.com/ngx-formly/ngx-formly/issues/2052)) ([80e7c14](https://github.com/ngx-formly/ngx-formly/commit/80e7c14)), closes [#2042](https://github.com/ngx-formly/ngx-formly/issues/2042)


### Performance Improvements

* **core:** reduce number of created components during the buil… ([#2069](https://github.com/ngx-formly/ngx-formly/issues/2069)) ([f371aad](https://github.com/ngx-formly/ngx-formly/commit/f371aad))



<a name="5.5.10"></a>
## [5.5.10](https://github.com/ngx-formly/ngx-formly/compare/v5.5.9...v5.5.10) (2020-01-20)


### Bug Fixes

* **core:** improve detect changes of formly-field host binding ([#2033](https://github.com/ngx-formly/ngx-formly/issues/2033)) ([47fe101](https://github.com/ngx-formly/ngx-formly/commit/47fe101)), closes [#2031](https://github.com/ngx-formly/ngx-formly/issues/2031)
* **material:** allow overriding tabindex on mat-radio-group ([#2034](https://github.com/ngx-formly/ngx-formly/issues/2034)) ([4f397ae](https://github.com/ngx-formly/ngx-formly/commit/4f397ae)), closes [#2032](https://github.com/ngx-formly/ngx-formly/issues/2032)



<a name="5.5.9"></a>
## [5.5.9](https://github.com/ngx-formly/ngx-formly/compare/v5.5.8...v5.5.9) (2020-01-13)


### Bug Fixes

* **core:** avoid re-use the removed controls of fieldArray ([ce02649](https://github.com/ngx-formly/ngx-formly/commit/ce02649))
* **core:** rely on ngZone to detect changes instead of changeDe… ([#2027](https://github.com/ngx-formly/ngx-formly/issues/2027)) ([2e838a0](https://github.com/ngx-formly/ngx-formly/commit/2e838a0)), closes [#2018](https://github.com/ngx-formly/ngx-formly/issues/2018)
* **core:** take account of custom formControl value changes ([#2017](https://github.com/ngx-formly/ngx-formly/issues/2017)) ([c8dacb5](https://github.com/ngx-formly/ngx-formly/commit/c8dacb5)), closes [#2016](https://github.com/ngx-formly/ngx-formly/issues/2016)
* **core:** update validity of detached field control ([503e793](https://github.com/ngx-formly/ngx-formly/commit/503e793))
* **json-schema:** ensure default value is applied on switch oneOf schema ([f04cdde](https://github.com/ngx-formly/ngx-formly/commit/f04cdde))


### Performance Improvements

* **bootstrap:** improve render time of long list for select ty… ([#2023](https://github.com/ngx-formly/ngx-formly/issues/2023)) ([cd198f3](https://github.com/ngx-formly/ngx-formly/commit/cd198f3)), closes [#2022](https://github.com/ngx-formly/ngx-formly/issues/2022)



<a name="5.5.8"></a>
## [5.5.8](https://github.com/ngx-formly/ngx-formly/compare/v5.5.7...v5.5.8) (2020-01-06)


### Bug Fixes

* **core:** avoid touching hidden field control on re-build ([#1989](https://github.com/ngx-formly/ngx-formly/issues/1989)) ([f982c32](https://github.com/ngx-formly/ngx-formly/commit/f982c32)), closes [#1987](https://github.com/ngx-formly/ngx-formly/issues/1987)
* **core:** detect changes before emitting `modelChange` ([#2001](https://github.com/ngx-formly/ngx-formly/issues/2001)) ([73e1651](https://github.com/ngx-formly/ngx-formly/commit/73e1651))
* **core:** eval expressions after `reset` is fully processed ([#1998](https://github.com/ngx-formly/ngx-formly/issues/1998)) ([2f785e0](https://github.com/ngx-formly/ngx-formly/commit/2f785e0))
* **core:** ignore removed controls on reset ([#1997](https://github.com/ngx-formly/ngx-formly/issues/1997)) ([0d76f50](https://github.com/ngx-formly/ngx-formly/commit/0d76f50))
* **core:** improve handling validation of hidden fields ([#2008](https://github.com/ngx-formly/ngx-formly/issues/2008)) ([298a152](https://github.com/ngx-formly/ngx-formly/commit/298a152))
* **core:** reduce the amount of emitted valueChanges event ([#1990](https://github.com/ngx-formly/ngx-formly/issues/1990)) ([b940a8e](https://github.com/ngx-formly/ngx-formly/commit/b940a8e)), closes [#1970](https://github.com/ngx-formly/ngx-formly/issues/1970)
* **core:** render template type when used in expressionProperti… ([#2010](https://github.com/ngx-formly/ngx-formly/issues/2010)) ([796547a](https://github.com/ngx-formly/ngx-formly/commit/796547a))
* **json-schema:** assign default value when the field is shown ([#2006](https://github.com/ngx-formly/ngx-formly/issues/2006)) ([fb65684](https://github.com/ngx-formly/ngx-formly/commit/fb65684)), closes [#1995](https://github.com/ngx-formly/ngx-formly/issues/1995)
* **json-schema:** enable autclear for extended schema with oneOf ([#2014](https://github.com/ngx-formly/ngx-formly/issues/2014)) ([a92c88f](https://github.com/ngx-formly/ngx-formly/commit/a92c88f))
* **json-schema:** rely on initialModel to resolve oneOf schema ([#2009](https://github.com/ngx-formly/ngx-formly/issues/2009)) ([8ce506b](https://github.com/ngx-formly/ngx-formly/commit/8ce506b))
* **material:** take account of min/max and step attr for slider type ([#2015](https://github.com/ngx-formly/ngx-formly/issues/2015)) ([3476948](https://github.com/ngx-formly/ngx-formly/commit/3476948))


### Performance Improvements

* **core:** reduce the emitted `modelChange` events ([#1999](https://github.com/ngx-formly/ngx-formly/issues/1999)) ([b7567a1](https://github.com/ngx-formly/ngx-formly/commit/b7567a1))
* **core:** reduce the registered formlyAttributes event listen… ([#1992](https://github.com/ngx-formly/ngx-formly/issues/1992)) ([e1ef87e](https://github.com/ngx-formly/ngx-formly/commit/e1ef87e)), closes [#1991](https://github.com/ngx-formly/ngx-formly/issues/1991)
* **core:** use OnPush change detection on FormlyValidationMess… ([#1996](https://github.com/ngx-formly/ngx-formly/issues/1996)) ([70ffd5d](https://github.com/ngx-formly/ngx-formly/commit/70ffd5d))



<a name="5.5.7"></a>
## [5.5.7](https://github.com/ngx-formly/ngx-formly/compare/v5.5.6...v5.5.7) (2019-12-17)


### Bug Fixes

* **bootstrap:** add missing compareWith input to the select type ([#1978](https://github.com/ngx-formly/ngx-formly/issues/1978)) ([14f9964](https://github.com/ngx-formly/ngx-formly/commit/14f9964)), closes [#1974](https://github.com/ngx-formly/ngx-formly/issues/1974)
* **core:** check expressions before emitting modelChange ([#1977](https://github.com/ngx-formly/ngx-formly/issues/1977)) ([510570e](https://github.com/ngx-formly/ngx-formly/commit/510570e))
* **core:** fix max calls error when dealing with sync valueChanges ([#1973](https://github.com/ngx-formly/ngx-formly/issues/1973)) ([f685d3b](https://github.com/ngx-formly/ngx-formly/commit/f685d3b))
* **ionic:** add missing dialog text inputs ([#1979](https://github.com/ngx-formly/ngx-formly/issues/1979)) ([95b0815](https://github.com/ngx-formly/ngx-formly/commit/95b0815)), closes [#1963](https://github.com/ngx-formly/ngx-formly/issues/1963)
* **json-schema:** take account of model value on resolve oneOf schema ([#1968](https://github.com/ngx-formly/ngx-formly/issues/1968)) ([0330789](https://github.com/ngx-formly/ngx-formly/commit/0330789)), closes [#1957](https://github.com/ngx-formly/ngx-formly/issues/1957)
* **material:** avoid unnecessary focus when Radio Button is selected ([0665700](https://github.com/ngx-formly/ngx-formly/commit/0665700)), closes [#1969](https://github.com/ngx-formly/ngx-formly/issues/1969)
* **material:** disable tabindex for MatRadioGroup element ([26bea8f](https://github.com/ngx-formly/ngx-formly/commit/26bea8f)), closes [#1969](https://github.com/ngx-formly/ngx-formly/issues/1969)



<a name="5.5.6"></a>
## [5.5.6](https://github.com/ngx-formly/ngx-formly/compare/v5.5.5...v5.5.6) (2019-11-20)


### Bug Fixes

* **core:** init disabled state to avoid emit change on re-build ([#1949](https://github.com/ngx-formly/ngx-formly/issues/1949)) ([c2842b9](https://github.com/ngx-formly/ngx-formly/commit/c2842b9))
* **core:** move field first render call to onChanges ([#1941](https://github.com/ngx-formly/ngx-formly/issues/1941)) ([56f1032](https://github.com/ngx-formly/ngx-formly/commit/56f1032)), closes [#1938](https://github.com/ngx-formly/ngx-formly/issues/1938)
* **core:** propagate disabled state to subfields ([#1943](https://github.com/ngx-formly/ngx-formly/issues/1943)) ([f0d9695](https://github.com/ngx-formly/ngx-formly/commit/f0d9695)), closes [#1528](https://github.com/ngx-formly/ngx-formly/issues/1528) [#1722](https://github.com/ngx-formly/ngx-formly/issues/1722) [#1743](https://github.com/ngx-formly/ngx-formly/issues/1743)
* **json-schema:** verify templateOptions exists on field ([#1948](https://github.com/ngx-formly/ngx-formly/issues/1948)) ([29a0b0e](https://github.com/ngx-formly/ngx-formly/commit/29a0b0e))
* **material:** allow prefix/suffix focus ([#1940](https://github.com/ngx-formly/ngx-formly/issues/1940)) ([5907dc5](https://github.com/ngx-formly/ngx-formly/commit/5907dc5)), closes [#1935](https://github.com/ngx-formly/ngx-formly/issues/1935)



<a name="5.5.5"></a>
## [5.5.5](https://github.com/ngx-formly/ngx-formly/compare/v5.5.4...v5.5.5) (2019-11-18)


### Bug Fixes

* **core:** avoid recursive focus/blur calls ([#1936](https://github.com/ngx-formly/ngx-formly/issues/1936)) ([1ea96f9](https://github.com/ngx-formly/ngx-formly/commit/1ea96f9)), closes [#1935](https://github.com/ngx-formly/ngx-formly/issues/1935)
* **core:** check if content is defined ([#1925](https://github.com/ngx-formly/ngx-formly/issues/1925)) ([a68a719](https://github.com/ngx-formly/ngx-formly/commit/a68a719))
* **core:** propagate disabled state to hidden fields ([#1939](https://github.com/ngx-formly/ngx-formly/issues/1939)) ([2cc9170](https://github.com/ngx-formly/ngx-formly/commit/2cc9170)), closes [#1932](https://github.com/ngx-formly/ngx-formly/issues/1932)
* **core:** use bind of the cloned object for enumerable getter ([#1924](https://github.com/ngx-formly/ngx-formly/issues/1924)) ([927151b](https://github.com/ngx-formly/ngx-formly/commit/927151b)), closes [#1923](https://github.com/ngx-formly/ngx-formly/issues/1923)
* **json-schema:** allow adjusting field Array before build step ([#1919](https://github.com/ngx-formly/ngx-formly/issues/1919)) ([3ae0e8a](https://github.com/ngx-formly/ngx-formly/commit/3ae0e8a))
* **json-schema:** handle oneOf when resolving schema deps ([#1933](https://github.com/ngx-formly/ngx-formly/issues/1933)) ([9ee889e](https://github.com/ngx-formly/ngx-formly/commit/9ee889e)), closes [#1928](https://github.com/ngx-formly/ngx-formly/issues/1928)
* **material:** force static query for FormField wrapper ([#1927](https://github.com/ngx-formly/ngx-formly/issues/1927)) ([7e7c4ca](https://github.com/ngx-formly/ngx-formly/commit/7e7c4ca)), closes [#1900](https://github.com/ngx-formly/ngx-formly/issues/1900)



<a name="5.5.4"></a>
## [5.5.4](https://github.com/ngx-formly/ngx-formly/compare/v5.5.3...v5.5.4) (2019-11-10)


### Bug Fixes

* **core:** emit a valid model when using array notation key in group ([#1910](https://github.com/ngx-formly/ngx-formly/issues/1910)) ([e4cd721](https://github.com/ngx-formly/ngx-formly/commit/e4cd721)), closes [#1857](https://github.com/ngx-formly/ngx-formly/issues/1857)
* **core:** ignore default debounce when using updateOn blur/submit ([#1903](https://github.com/ngx-formly/ngx-formly/issues/1903)) ([2d73fb9](https://github.com/ngx-formly/ngx-formly/commit/2d73fb9)), closes [#1898](https://github.com/ngx-formly/ngx-formly/issues/1898)
* **core:** include field without key on hide changed programmatically ([#1904](https://github.com/ngx-formly/ngx-formly/issues/1904)) ([39a9051](https://github.com/ngx-formly/ngx-formly/commit/39a9051))
* **core:** skip detectChanges call on first render ([#1905](https://github.com/ngx-formly/ngx-formly/issues/1905)) ([24396a3](https://github.com/ngx-formly/ngx-formly/commit/24396a3)), closes [#1900](https://github.com/ngx-formly/ngx-formly/issues/1900)



<a name="5.5.3"></a>
## [5.5.3](https://github.com/ngx-formly/ngx-formly/compare/v5.5.2...v5.5.3) (2019-11-01)


### Bug Fixes

* **core:** ensure the first render is called after onInit ([#1881](https://github.com/ngx-formly/ngx-formly/issues/1881)) ([73f0316](https://github.com/ngx-formly/ngx-formly/commit/73f0316))
* **core:** set static flag to false for ivy support ([#1893](https://github.com/ngx-formly/ngx-formly/issues/1893)) ([9a63c3e](https://github.com/ngx-formly/ngx-formly/commit/9a63c3e))
* **core:** toggle control when hide changed programmatically ([#1888](https://github.com/ngx-formly/ngx-formly/issues/1888)) ([fdb1cbe](https://github.com/ngx-formly/ngx-formly/commit/fdb1cbe)), closes [#1817](https://github.com/ngx-formly/ngx-formly/issues/1817) [#1742](https://github.com/ngx-formly/ngx-formly/issues/1742)
* **core:** update form validity when changing built-in validations ([#1887](https://github.com/ngx-formly/ngx-formly/issues/1887)) ([fb8485d](https://github.com/ngx-formly/ngx-formly/commit/fb8485d)), closes [#1493](https://github.com/ngx-formly/ngx-formly/issues/1493)



<a name="5.5.2"></a>
## [5.5.2](https://github.com/ngx-formly/ngx-formly/compare/v5.5.1...v5.5.2) (2019-10-29)


### Bug Fixes

* **core:** change the check File instance for SSR compatibility ([#1865](https://github.com/ngx-formly/ngx-formly/issues/1865)) ([7883f1a](https://github.com/ngx-formly/ngx-formly/commit/7883f1a)), closes [#1864](https://github.com/ngx-formly/ngx-formly/issues/1864)
* **core:** clone initialModel during reset model ([#1874](https://github.com/ngx-formly/ngx-formly/issues/1874)) ([e706cf8](https://github.com/ngx-formly/ngx-formly/commit/e706cf8)), closes [#1872](https://github.com/ngx-formly/ngx-formly/issues/1872)
* **core:** ensure array notation for key emit a valid model ([#1859](https://github.com/ngx-formly/ngx-formly/issues/1859)) ([0b3ab37](https://github.com/ngx-formly/ngx-formly/commit/0b3ab37)), closes [#1857](https://github.com/ngx-formly/ngx-formly/issues/1857)
* **core:** ensure the validation calls occurs only once during build ([#1866](https://github.com/ngx-formly/ngx-formly/issues/1866)) ([770bea9](https://github.com/ngx-formly/ngx-formly/commit/770bea9)), closes [#1754](https://github.com/ngx-formly/ngx-formly/issues/1754)
* **core:** support resolving non static fieldComponent query ([#1878](https://github.com/ngx-formly/ngx-formly/issues/1878)) ([ac7e9a2](https://github.com/ngx-formly/ngx-formly/commit/ac7e9a2)), closes [#1868](https://github.com/ngx-formly/ngx-formly/issues/1868)
* **core:** toggle controls of the hidden fields before the visible ones ([#1875](https://github.com/ngx-formly/ngx-formly/issues/1875)) ([d35460e](https://github.com/ngx-formly/ngx-formly/commit/d35460e)), closes [#1700](https://github.com/ngx-formly/ngx-formly/issues/1700)
* **ionic:** add missing export of ionFormlyAttributes ([#1880](https://github.com/ngx-formly/ngx-formly/issues/1880)) ([679ee10](https://github.com/ngx-formly/ngx-formly/commit/679ee10)), closes [#1879](https://github.com/ngx-formly/ngx-formly/issues/1879)
* **json-schema:** use multi-select to handle anyOf schema ([eb71a68](https://github.com/ngx-formly/ngx-formly/commit/eb71a68))
* **material:** avoid using deprecated underlineRef ([#1860](https://github.com/ngx-formly/ngx-formly/issues/1860)) ([807218f](https://github.com/ngx-formly/ngx-formly/commit/807218f))
* **material:** support selectAll in multiselect with group ([#1867](https://github.com/ngx-formly/ngx-formly/issues/1867)) ([f5625ea](https://github.com/ngx-formly/ngx-formly/commit/f5625ea)), closes [#1852](https://github.com/ngx-formly/ngx-formly/issues/1852)
* make FormlyModule ModuleWithProviders generic for ng9 support ([#1854](https://github.com/ngx-formly/ngx-formly/issues/1854)) ([dbb860d](https://github.com/ngx-formly/ngx-formly/commit/dbb860d))



<a name="5.5.1"></a>
## [5.5.1](https://github.com/ngx-formly/ngx-formly/compare/v5.5.0...v5.5.1) (2019-10-15)


### Bug Fixes

* **core:** add warn when using legacy select option ([#1840](https://github.com/ngx-formly/ngx-formly/issues/1840)) ([bf2448d](https://github.com/ngx-formly/ngx-formly/commit/bf2448d))
* **core:** apply sync value only when key is duplicated ([#1837](https://github.com/ngx-formly/ngx-formly/issues/1837)) ([4a34464](https://github.com/ngx-formly/ngx-formly/commit/4a34464))
* **core:** merge existing options when replacing a field type ([#1838](https://github.com/ngx-formly/ngx-formly/issues/1838)) ([177c4f4](https://github.com/ngx-formly/ngx-formly/commit/177c4f4)), closes [#1836](https://github.com/ngx-formly/ngx-formly/issues/1836)



<a name="5.5.0"></a>
# [5.5.0](https://github.com/ngx-formly/ngx-formly/compare/v5.4.3...v5.5.0) (2019-10-09)


### Bug Fixes

* **core:** fix various errors during SSR ([921a451](https://github.com/ngx-formly/ngx-formly/commit/921a451)), closes [#1821](https://github.com/ngx-formly/ngx-formly/issues/1821)
* **core:** sync value changes for fields with same key ([#1820](https://github.com/ngx-formly/ngx-formly/issues/1820)) ([6f7a10a](https://github.com/ngx-formly/ngx-formly/commit/6f7a10a)), closes [#1358](https://github.com/ngx-formly/ngx-formly/issues/1358)
* **kendo:** add name attr to radio type ([#1807](https://github.com/ngx-formly/ngx-formly/issues/1807)) ([10348bf](https://github.com/ngx-formly/ngx-formly/commit/10348bf)), closes [#1805](https://github.com/ngx-formly/ngx-formly/issues/1805)


### Features

* **core:** deprecate passing content inside the 'formly-form' tag ([#1826](https://github.com/ngx-formly/ngx-formly/issues/1826)) ([0f168f7](https://github.com/ngx-formly/ngx-formly/commit/0f168f7))
* **core:** deprecate passing immutable attr to formly-form component ([#1827](https://github.com/ngx-formly/ngx-formly/issues/1827)) ([61f9391](https://github.com/ngx-formly/ngx-formly/commit/61f9391))
* **core:** mark the form array dirty on Add/Remove ([#1824](https://github.com/ngx-formly/ngx-formly/issues/1824)) ([92bb6d7](https://github.com/ngx-formly/ngx-formly/commit/92bb6d7)), closes [#1679](https://github.com/ngx-formly/ngx-formly/issues/1679)
* **ionic:** allow customize <ion-item> lines ([#1809](https://github.com/ngx-formly/ngx-formly/issues/1809)) ([94dd5cc](https://github.com/ngx-formly/ngx-formly/commit/94dd5cc)), closes [#1732](https://github.com/ngx-formly/ngx-formly/issues/1732)
* **json-schema:** add const validator ([#1825](https://github.com/ngx-formly/ngx-formly/issues/1825)) ([4607b1c](https://github.com/ngx-formly/ngx-formly/commit/4607b1c))
* **json-schema:** add support for adding custom labels to enum ([#1802](https://github.com/ngx-formly/ngx-formly/issues/1802)) ([a96c8fe](https://github.com/ngx-formly/ngx-formly/commit/a96c8fe))
* **json-schema:** add support for uniqueItems ([#1812](https://github.com/ngx-formly/ngx-formly/issues/1812)) ([9164c74](https://github.com/ngx-formly/ngx-formly/commit/9164c74))
* **json-schema:** partial support of anyOf/oneOf keyword ([#1811](https://github.com/ngx-formly/ngx-formly/issues/1811)) ([d60e0f5](https://github.com/ngx-formly/ngx-formly/commit/d60e0f5))
* **json-schema:** support multiselect type ([#1813](https://github.com/ngx-formly/ngx-formly/issues/1813)) ([371723e](https://github.com/ngx-formly/ngx-formly/commit/371723e))



<a name="5.4.3"></a>
## [5.4.3](https://github.com/ngx-formly/ngx-formly/compare/v5.4.2...v5.4.3) (2019-09-20)


### Bug Fixes

* **core:** better clone for File and moment.js instance ([#1789](https://github.com/ngx-formly/ngx-formly/issues/1789)) ([d810035](https://github.com/ngx-formly/ngx-formly/commit/d810035)), closes [#1788](https://github.com/ngx-formly/ngx-formly/issues/1788)
* **core:** skip _markForCheck call during init ([#1792](https://github.com/ngx-formly/ngx-formly/issues/1792)) ([718920a](https://github.com/ngx-formly/ngx-formly/commit/718920a))
* **json-schema:** set nullable string type to `null` if empty ([#1787](https://github.com/ngx-formly/ngx-formly/issues/1787)) ([8d4985b](https://github.com/ngx-formly/ngx-formly/commit/8d4985b))



<a name="5.4.2"></a>
## [5.4.2](https://github.com/ngx-formly/ngx-formly/compare/v5.4.1...v5.4.2) (2019-09-16)


### Bug Fixes

* **core:** allow nullable value for array type ([#1780](https://github.com/ngx-formly/ngx-formly/issues/1780)) ([d8f5f61](https://github.com/ngx-formly/ngx-formly/commit/d8f5f61)), closes [#1764](https://github.com/ngx-formly/ngx-formly/issues/1764)
* **core:** avoid checking parent field on eval hide expression ([#1749](https://github.com/ngx-formly/ngx-formly/issues/1749)) ([087523b](https://github.com/ngx-formly/ngx-formly/commit/087523b)), closes [#1700](https://github.com/ngx-formly/ngx-formly/issues/1700)
* **json-schema:** guess nullable and single array type ([#1781](https://github.com/ngx-formly/ngx-formly/issues/1781)) ([dabf2a6](https://github.com/ngx-formly/ngx-formly/commit/dabf2a6)), closes [#1777](https://github.com/ngx-formly/ngx-formly/issues/1777)
* **json-schema:** set valid fieldArray when additionalItems is empty ([#1784](https://github.com/ngx-formly/ngx-formly/issues/1784)) ([4413193](https://github.com/ngx-formly/ngx-formly/commit/4413193)), closes [#1777](https://github.com/ngx-formly/ngx-formly/issues/1777)
* **material:** ensure showing datepicker icon when OnPush enabled ([#1767](https://github.com/ngx-formly/ngx-formly/issues/1767)) ([6ef3e57](https://github.com/ngx-formly/ngx-formly/commit/6ef3e57)), closes [#1766](https://github.com/ngx-formly/ngx-formly/issues/1766)
* **material:** use passed aria-labelledby attr for select type ([#1748](https://github.com/ngx-formly/ngx-formly/issues/1748)) ([b8f1834](https://github.com/ngx-formly/ngx-formly/commit/b8f1834)), closes [#1746](https://github.com/ngx-formly/ngx-formly/issues/1746)



<a name="5.4.1"></a>
## [5.4.1](https://github.com/ngx-formly/ngx-formly/compare/v5.4.0...v5.4.1) (2019-08-26)


### Bug Fixes

* **core:** avoid removing the wrong formControl instance on hide ([#1741](https://github.com/ngx-formly/ngx-formly/issues/1741)) ([9a68aaf](https://github.com/ngx-formly/ngx-formly/commit/9a68aaf)), closes [#1700](https://github.com/ngx-formly/ngx-formly/issues/1700)
* **material:** enable static query for formFieldControl ([#1740](https://github.com/ngx-formly/ngx-formly/issues/1740)) ([512befe](https://github.com/ngx-formly/ngx-formly/commit/512befe))
* **material:** enable static query for MatFormField ([#1733](https://github.com/ngx-formly/ngx-formly/issues/1733)) ([038c22d](https://github.com/ngx-formly/ngx-formly/commit/038c22d))



<a name="5.4.0"></a>
# [5.4.0](https://github.com/ngx-formly/ngx-formly/compare/v5.3.0...v5.4.0) (2019-08-19)


### Bug Fixes

* **core:** better cloning ([#1725](https://github.com/ngx-formly/ngx-formly/issues/1725)) ([0b71eba](https://github.com/ngx-formly/ngx-formly/commit/0b71eba)), closes [#1719](https://github.com/ngx-formly/ngx-formly/issues/1719)
* **core:** mark formControl as dirty on change event ([#1727](https://github.com/ngx-formly/ngx-formly/issues/1727)) ([8c29130](https://github.com/ngx-formly/ngx-formly/commit/8c29130)), closes [#1721](https://github.com/ngx-formly/ngx-formly/issues/1721)
* **material:** disable floating label when select value is empty ([#1707](https://github.com/ngx-formly/ngx-formly/issues/1707)) ([a462a72](https://github.com/ngx-formly/ngx-formly/commit/a462a72))
* **material:** float textarea label when value is set ([#1697](https://github.com/ngx-formly/ngx-formly/issues/1697)) ([c6461d4](https://github.com/ngx-formly/ngx-formly/commit/c6461d4)), closes [#1688](https://github.com/ngx-formly/ngx-formly/issues/1688)
* **material:** improve handling focus for custom form-field ([#1696](https://github.com/ngx-formly/ngx-formly/issues/1696)) ([057eaa9](https://github.com/ngx-formly/ngx-formly/commit/057eaa9)), closes [#1691](https://github.com/ngx-formly/ngx-formly/issues/1691)


### Features

* **core:** add support of ivy ([#1695](https://github.com/ngx-formly/ngx-formly/issues/1695)) ([ce3759d](https://github.com/ngx-formly/ngx-formly/commit/ce3759d)), closes [#1693](https://github.com/ngx-formly/ngx-formly/issues/1693)
* **core:** generate FormControl when `key` is set ([#1714](https://github.com/ngx-formly/ngx-formly/issues/1714)) ([562cb44](https://github.com/ngx-formly/ngx-formly/commit/562cb44)), closes [#1711](https://github.com/ngx-formly/ngx-formly/issues/1711)
* **core:** mark define fieldComponent optional for custom wrapper ([#1694](https://github.com/ngx-formly/ngx-formly/issues/1694)) ([a013fe2](https://github.com/ngx-formly/ngx-formly/commit/a013fe2))
* **json-schema:** add support for minItems and maxItems ([#1698](https://github.com/ngx-formly/ngx-formly/issues/1698)) ([2d6fcd4](https://github.com/ngx-formly/ngx-formly/commit/2d6fcd4))
* **json-schema:** adds allOf support ([#1683](https://github.com/ngx-formly/ngx-formly/issues/1683)) ([d8e9585](https://github.com/ngx-formly/ngx-formly/commit/d8e9585))
* **json-schema:** merge required and base schema on resolve allOf ([#1728](https://github.com/ngx-formly/ngx-formly/issues/1728)) ([f43ad58](https://github.com/ngx-formly/ngx-formly/commit/f43ad58))
* **json-schema:** resolve allOf merge conflits ([#1729](https://github.com/ngx-formly/ngx-formly/issues/1729)) ([bf108ba](https://github.com/ngx-formly/ngx-formly/commit/bf108ba))
* **json-schema:** support null type ([#1730](https://github.com/ngx-formly/ngx-formly/issues/1730)) ([7d5ac6a](https://github.com/ngx-formly/ngx-formly/commit/7d5ac6a))



<a name="5.3.0"></a>
# [5.3.0](https://github.com/ngx-formly/ngx-formly/compare/v5.2.0...v5.3.0) (2019-07-24)


### Bug Fixes

* **core:** add warn for missing static flag for @ViewChild ([#1673](https://github.com/ngx-formly/ngx-formly/issues/1673)) ([b0972a2](https://github.com/ngx-formly/ngx-formly/commit/b0972a2)), closes [#1633](https://github.com/ngx-formly/ngx-formly/issues/1633)
* **core:** avoid assigning defaultValue by reference ([#1687](https://github.com/ngx-formly/ngx-formly/issues/1687)) ([4ac1fe3](https://github.com/ngx-formly/ngx-formly/commit/4ac1fe3)), closes [#1684](https://github.com/ngx-formly/ngx-formly/issues/1684)
* **core:** override existing form group instance on re-build ([#1680](https://github.com/ngx-formly/ngx-formly/issues/1680)) ([8ddffee](https://github.com/ngx-formly/ngx-formly/commit/8ddffee)), closes [#1677](https://github.com/ngx-formly/ngx-formly/issues/1677)
* **json-schema:** handle passing empty value for number type ([#1657](https://github.com/ngx-formly/ngx-formly/issues/1657)) ([070f558](https://github.com/ngx-formly/ngx-formly/commit/070f558))


### Features

* **core:** allow check expression on model changes only ([#1662](https://github.com/ngx-formly/ngx-formly/issues/1662)) ([32cde3c](https://github.com/ngx-formly/ngx-formly/commit/32cde3c)), closes [#1620](https://github.com/ngx-formly/ngx-formly/issues/1620)
* **json-schema:** add support for $ref ([#1658](https://github.com/ngx-formly/ngx-formly/issues/1658)) ([2e52ffa](https://github.com/ngx-formly/ngx-formly/commit/2e52ffa))
* **json-schema:** add support for dependencies ([#1659](https://github.com/ngx-formly/ngx-formly/issues/1659)) ([af5d5ac](https://github.com/ngx-formly/ngx-formly/commit/af5d5ac))
* **json-schema:** add support for exclusiveMinimum & exclusiveMaximum ([#1682](https://github.com/ngx-formly/ngx-formly/issues/1682)) ([99da1bf](https://github.com/ngx-formly/ngx-formly/commit/99da1bf))
* **json-schema:** add support for multipleOf ([#1655](https://github.com/ngx-formly/ngx-formly/issues/1655)) ([c7601e7](https://github.com/ngx-formly/ngx-formly/commit/c7601e7))
* **json-schema:** guess object type ([#1656](https://github.com/ngx-formly/ngx-formly/issues/1656)) ([912edf7](https://github.com/ngx-formly/ngx-formly/commit/912edf7))
* **material:** add textarea autosize ([#1672](https://github.com/ngx-formly/ngx-formly/issues/1672)) ([3937eca](https://github.com/ngx-formly/ngx-formly/commit/3937eca)), closes [#1670](https://github.com/ngx-formly/ngx-formly/issues/1670)



<a name="5.2.0"></a>
# [5.2.0](https://github.com/ngx-formly/ngx-formly/compare/v5.1.9...v5.2.0) (2019-07-08)


### Bug Fixes

* **bootstrap:** select empty option when value is null ([#1652](https://github.com/ngx-formly/ngx-formly/issues/1652)) ([50a1138](https://github.com/ngx-formly/ngx-formly/commit/50a1138)), closes [#1625](https://github.com/ngx-formly/ngx-formly/issues/1625)
* **core:** restore support component-level injectors for types ([#1651](https://github.com/ngx-formly/ngx-formly/issues/1651)) ([165ac75](https://github.com/ngx-formly/ngx-formly/commit/165ac75)), closes [#1622](https://github.com/ngx-formly/ngx-formly/issues/1622)
* **material:** avoid handling focus for selected radio option ([#1648](https://github.com/ngx-formly/ngx-formly/issues/1648)) ([44535ac](https://github.com/ngx-formly/ngx-formly/commit/44535ac)), closes [#1631](https://github.com/ngx-formly/ngx-formly/issues/1631)
* **material:** remove duplicated change event listener ([#1649](https://github.com/ngx-formly/ngx-formly/issues/1649)) ([d28f7a8](https://github.com/ngx-formly/ngx-formly/commit/d28f7a8)), closes [#1644](https://github.com/ngx-formly/ngx-formly/issues/1644)


### Features

* **core:** take account of enumerable getter on clone ([#1637](https://github.com/ngx-formly/ngx-formly/issues/1637)) ([66239d9](https://github.com/ngx-formly/ngx-formly/commit/66239d9))



<a name="5.1.9"></a>
## [5.1.9](https://github.com/ngx-formly/ngx-formly/compare/v5.1.8...v5.1.9) (2019-06-04)


### Bug Fixes

* **material:** multi-select when passing observable data ([#1614](https://github.com/ngx-formly/ngx-formly/issues/1614)) ([e74bd4e](https://github.com/ngx-formly/ngx-formly/commit/e74bd4e))



<a name="5.1.8"></a>
## [5.1.8](https://github.com/ngx-formly/ngx-formly/compare/v5.1.7...v5.1.8) (2019-05-31)


### Bug Fixes

* **core:** avoid rerender on model change with immutable mode ([#1610](https://github.com/ngx-formly/ngx-formly/issues/1610)) ([16fc39e](https://github.com/ngx-formly/ngx-formly/commit/16fc39e)), closes [#1429](https://github.com/ngx-formly/ngx-formly/issues/1429)



<a name="5.1.7"></a>
## [5.1.7](https://github.com/ngx-formly/ngx-formly/compare/v5.1.6...v5.1.7) (2019-05-28)


### Bug Fixes

* **core:** add missing disabled & required html attribute ([#1603](https://github.com/ngx-formly/ngx-formly/issues/1603)) ([cbb3f91](https://github.com/ngx-formly/ngx-formly/commit/cbb3f91)), closes [#1582](https://github.com/ngx-formly/ngx-formly/issues/1582) [#1601](https://github.com/ngx-formly/ngx-formly/issues/1601)
* **core:** keep formcontrol state on remove fieldArray ([#1602](https://github.com/ngx-formly/ngx-formly/issues/1602)) ([85433eb](https://github.com/ngx-formly/ngx-formly/commit/85433eb))
* **core:** throw Error when `forRoot` call is missing ([#1604](https://github.com/ngx-formly/ngx-formly/issues/1604)) ([48d9dae](https://github.com/ngx-formly/ngx-formly/commit/48d9dae))



<a name="5.1.6"></a>
## [5.1.6](https://github.com/ngx-formly/ngx-formly/compare/v5.1.5...v5.1.6) (2019-05-24)


### Bug Fixes

* add missing change event for primeng & kendo ([#1596](https://github.com/ngx-formly/ngx-formly/issues/1596)) ([258afa0](https://github.com/ngx-formly/ngx-formly/commit/258afa0)), closes [#1595](https://github.com/ngx-formly/ngx-formly/issues/1595)



<a name="5.1.5"></a>
## [5.1.5](https://github.com/ngx-formly/ngx-formly/compare/v5.1.4...v5.1.5) (2019-05-20)


### Bug Fixes

* **core:** rely on option componentFactoryResolver for wrapper ([#1590](https://github.com/ngx-formly/ngx-formly/issues/1590)) ([7c8fc00](https://github.com/ngx-formly/ngx-formly/commit/7c8fc00))



<a name="5.1.4"></a>
## [5.1.4](https://github.com/ngx-formly/ngx-formly/compare/v5.1.3...v5.1.4) (2019-05-13)


### Bug Fixes

* **core:** assign a valid model for array index key ([#1587](https://github.com/ngx-formly/ngx-formly/issues/1587)) ([54024c9](https://github.com/ngx-formly/ngx-formly/commit/54024c9)), closes [#1584](https://github.com/ngx-formly/ngx-formly/issues/1584)



<a name="5.1.3"></a>
## [5.1.3](https://github.com/ngx-formly/ngx-formly/compare/v5.1.2...v5.1.3) (2019-05-07)


### Bug Fixes

* **core:** avoid overriding validators from directive ([#1579](https://github.com/ngx-formly/ngx-formly/issues/1579)) ([a9eecd2](https://github.com/ngx-formly/ngx-formly/commit/a9eecd2)), closes [#1578](https://github.com/ngx-formly/ngx-formly/issues/1578)



<a name="5.1.2"></a>
## [5.1.2](https://github.com/ngx-formly/ngx-formly/compare/v5.1.1...v5.1.2) (2019-05-06)


### Bug Fixes

* **core:** remove readonly when passing falsy value ([#1576](https://github.com/ngx-formly/ngx-formly/issues/1576)) ([2aaa80a](https://github.com/ngx-formly/ngx-formly/commit/2aaa80a)), closes [#1566](https://github.com/ngx-formly/ngx-formly/issues/1566)



<a name="5.1.1"></a>
## [5.1.1](https://github.com/ngx-formly/ngx-formly/compare/v5.1.0...v5.1.1) (2019-05-03)


### Bug Fixes

* **core:** allow passing a non array to the validation property ([#1575](https://github.com/ngx-formly/ngx-formly/issues/1575)) ([3cdc8fa](https://github.com/ngx-formly/ngx-formly/commit/3cdc8fa)), closes [#1573](https://github.com/ngx-formly/ngx-formly/issues/1573)



<a name="5.1.0"></a>
# [5.1.0](https://github.com/ngx-formly/ngx-formly/compare/v5.0.4...v5.1.0) (2019-04-28)


### Features

* **core:** add field arg to hideExpression and expressionProperties ([#1544](https://github.com/ngx-formly/ngx-formly/issues/1544)) ([24998ad](https://github.com/ngx-formly/ngx-formly/commit/24998ad)), closes [#704](https://github.com/ngx-formly/ngx-formly/issues/704)
* **core:** deprecate usage of `this.field` in expressionProperties ([#1550](https://github.com/ngx-formly/ngx-formly/issues/1550)) ([b6172b4](https://github.com/ngx-formly/ngx-formly/commit/b6172b4))
* **material:** add disableOptionCentering support for mat-select ([#1545](https://github.com/ngx-formly/ngx-formly/issues/1545)) ([9c655c6](https://github.com/ngx-formly/ngx-formly/commit/9c655c6))
* **material:** add select all option to multiselect ([#1552](https://github.com/ngx-formly/ngx-formly/issues/1552)) ([144f5fa](https://github.com/ngx-formly/ngx-formly/commit/144f5fa))
* **material:** adds datepicker toggle positioning support ([#1560](https://github.com/ngx-formly/ngx-formly/issues/1560)) ([63698b3](https://github.com/ngx-formly/ngx-formly/commit/63698b3))



<a name="5.0.4"></a>
## [5.0.4](https://github.com/ngx-formly/ngx-formly/compare/v5.0.3...v5.0.4) (2019-04-17)


### Bug Fixes

* **core:** fallback null fields to empty array ([#1534](https://github.com/ngx-formly/ngx-formly/issues/1534)) ([3608925](https://github.com/ngx-formly/ngx-formly/commit/3608925)), closes [#1530](https://github.com/ngx-formly/ngx-formly/issues/1530)
* avoid using forRoot for UI ([#1537](https://github.com/ngx-formly/ngx-formly/issues/1537)) ([72a6b7f](https://github.com/ngx-formly/ngx-formly/commit/72a6b7f)), closes [#1535](https://github.com/ngx-formly/ngx-formly/issues/1535)
* **material:** adjust empty value for number/bool type ([#1538](https://github.com/ngx-formly/ngx-formly/issues/1538)) ([5916765](https://github.com/ngx-formly/ngx-formly/commit/5916765))
* **material:** take account of formFieldControl changes ([#1533](https://github.com/ngx-formly/ngx-formly/issues/1533)) ([aa5c645](https://github.com/ngx-formly/ngx-formly/commit/aa5c645)), closes [#1029](https://github.com/ngx-formly/ngx-formly/issues/1029)


### Reverts

* disable control when parent is disabled ([#1539](https://github.com/ngx-formly/ngx-formly/issues/1539)) ([9f033d4](https://github.com/ngx-formly/ngx-formly/commit/9f033d4))



<a name="5.0.3"></a>
## [5.0.3](https://github.com/ngx-formly/ngx-formly/compare/v5.0.2...v5.0.3) (2019-04-15)


### Bug Fixes

* **core:** disable control when parent is disabled ([#1529](https://github.com/ngx-formly/ngx-formly/issues/1529)) ([2434984](https://github.com/ngx-formly/ngx-formly/commit/2434984)), closes [#1528](https://github.com/ngx-formly/ngx-formly/issues/1528)



<a name="5.0.2"></a>
## [5.0.2](https://github.com/ngx-formly/ngx-formly/compare/v5.0.1...v5.0.2) (2019-04-08)


### Bug Fixes

* **material:** add errorStateMatcher to autocomplete example ([#1517](https://github.com/ngx-formly/ngx-formly/issues/1517)) ([4606db9](https://github.com/ngx-formly/ngx-formly/commit/4606db9))
* **material:** add FieldType set value ([#1515](https://github.com/ngx-formly/ngx-formly/issues/1515)) ([93268e4](https://github.com/ngx-formly/ngx-formly/commit/93268e4))
* **material:** add missing attrs to native-select ([#1514](https://github.com/ngx-formly/ngx-formly/issues/1514)) ([8200078](https://github.com/ngx-formly/ngx-formly/commit/8200078))



<a name="5.0.1"></a>
## [5.0.1](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0...v5.0.1) (2019-04-03)


### Bug Fixes

* **core:** improve performance for FieldArrayType ([#1511](https://github.com/ngx-formly/ngx-formly/issues/1511)) ([cef8b96](https://github.com/ngx-formly/ngx-formly/commit/cef8b96)), closes [#1489](https://github.com/ngx-formly/ngx-formly/issues/1489)


### Performance Improvements

* **core:** avoid mixin string and number for KeyPath ([dffe082](https://github.com/ngx-formly/ngx-formly/commit/dffe082))
* **core:** avoid recursive calls for assignModelValue ([63310d2](https://github.com/ngx-formly/ngx-formly/commit/63310d2))
* **core:** avoid using unnecessary rxjs operators ([#1499](https://github.com/ngx-formly/ngx-formly/issues/1499)) ([cc59fcf](https://github.com/ngx-formly/ngx-formly/commit/cc59fcf))
* **core:** check date type using instanceof ([2d108db](https://github.com/ngx-formly/ngx-formly/commit/2d108db))
* **core:** reduce regex calls for getKeyPath ([#1501](https://github.com/ngx-formly/ngx-formly/issues/1501)) ([9e78c04](https://github.com/ngx-formly/ngx-formly/commit/9e78c04))
* **core:** rely on push instead of spread operaror ([4c363b2](https://github.com/ngx-formly/ngx-formly/commit/4c363b2))
* **core:** skip fieldParentFormControl call when field has parent ([#1500](https://github.com/ngx-formly/ngx-formly/issues/1500)) ([f5de20b](https://github.com/ngx-formly/ngx-formly/commit/f5de20b))
* **core:** updateValidity only when validators/asyncValidator change ([#1504](https://github.com/ngx-formly/ngx-formly/issues/1504)) ([57a2087](https://github.com/ngx-formly/ngx-formly/commit/57a2087))
* **core:** use for-of instead of while for getFieldValue ([a9841fb](https://github.com/ngx-formly/ngx-formly/commit/a9841fb))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.12...v5.0.0) (2019-03-23)

To upgrade from 4.0 to 5.0 see [UPGRADE-5.0](./UPGRADE-5.0.md)

<a name="5.0.0-rc.12"></a>
# [5.0.0-rc.12](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.11...v5.0.0-rc.12) (2019-03-17)


### Bug Fixes

* **material:** assign formly formField to MatDatepickerInput ([#1471](https://github.com/ngx-formly/ngx-formly/issues/1471)) ([c22b751](https://github.com/ngx-formly/ngx-formly/commit/c22b751))


### Features

* **core:** deep merge widget prop & add map callback ([#1467](https://github.com/ngx-formly/ngx-formly/issues/1467)) ([cdb33bb](https://github.com/ngx-formly/ngx-formly/commit/cdb33bb))



<a name="5.0.0-rc.11"></a>
# [5.0.0-rc.11](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.10...v5.0.0-rc.11) (2019-03-07)


### Bug Fixes

* **core:** pass a valid key for nested json-schema prop ([#1462](https://github.com/ngx-formly/ngx-formly/issues/1462)) ([dabe153](https://github.com/ngx-formly/ngx-formly/commit/dabe153))


### Features

* **core:** allow enable immutable mode through NgModule config ([#1460](https://github.com/ngx-formly/ngx-formly/issues/1460)) ([07438b2](https://github.com/ngx-formly/ngx-formly/commit/07438b2))



<a name="5.0.0-rc.10"></a>
# [5.0.0-rc.10](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.9...v5.0.0-rc.10) (2019-03-06)


### Bug Fixes

* **core:** avoid init model during addFormControl ([#1458](https://github.com/ngx-formly/ngx-formly/issues/1458)) ([2396d49](https://github.com/ngx-formly/ngx-formly/commit/2396d49)), closes [#1457](https://github.com/ngx-formly/ngx-formly/issues/1457)



<a name="5.0.0-rc.9"></a>
# [5.0.0-rc.9](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.8...v5.0.0-rc.9) (2019-03-03)


### Bug Fixes

* **core:** ensure repeat form is in sync with the model val ([#1451](https://github.com/ngx-formly/ngx-formly/issues/1451)) ([77feb5b](https://github.com/ngx-formly/ngx-formly/commit/77feb5b)), closes [#1450](https://github.com/ngx-formly/ngx-formly/issues/1450)



<a name="5.0.0-rc.8"></a>
# [5.0.0-rc.8](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.7...v5.0.0-rc.8) (2019-02-26)


### Bug Fixes

* **core:** avoid override hide field within fieldGroup ([#1444](https://github.com/ngx-formly/ngx-formly/issues/1444)) ([92057d4](https://github.com/ngx-formly/ngx-formly/commit/92057d4)), closes [#1259](https://github.com/ngx-formly/ngx-formly/issues/1259)



<a name="5.0.0-rc.7"></a>
# [5.0.0-rc.7](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.6...v5.0.0-rc.7) (2019-02-22)


### Bug Fixes

* **core:** assign a valid value for nested key model ([#1438](https://github.com/ngx-formly/ngx-formly/issues/1438)) ([1ac2c39](https://github.com/ngx-formly/ngx-formly/commit/1ac2c39)), closes [#1437](https://github.com/ngx-formly/ngx-formly/issues/1437)
* **ionic:** user setFocus instead of native focus callback ([#1442](https://github.com/ngx-formly/ngx-formly/issues/1442)) ([309a9d6](https://github.com/ngx-formly/ngx-formly/commit/309a9d6)), closes [#1374](https://github.com/ngx-formly/ngx-formly/issues/1374)



<a name="5.0.0-rc.6"></a>
# [5.0.0-rc.6](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.5...v5.0.0-rc.6) (2019-02-21)


### Bug Fixes

* **core:** fix memory leak when using immutable attr ([#1434](https://github.com/ngx-formly/ngx-formly/issues/1434)) ([0885836](https://github.com/ngx-formly/ngx-formly/commit/0885836))



<a name="5.0.0-rc.5"></a>
# [5.0.0-rc.5](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.4...v5.0.0-rc.5) (2019-02-19)


### Bug Fixes

* **core:** manage field focus of multi formlyAttributes ([#1433](https://github.com/ngx-formly/ngx-formly/issues/1433)) ([bcae130](https://github.com/ngx-formly/ngx-formly/commit/bcae130)), closes [#1428](https://github.com/ngx-formly/ngx-formly/issues/1428)
* **core:** revert [#1427](https://github.com/ngx-formly/ngx-formly/issues/1427) in favor of immutable mode ([#1430](https://github.com/ngx-formly/ngx-formly/issues/1430)) ([#1431](https://github.com/ngx-formly/ngx-formly/issues/1431)) ([54dfcd4](https://github.com/ngx-formly/ngx-formly/commit/54dfcd4))


### Features

* **core:** add support for immutable mode ([#1430](https://github.com/ngx-formly/ngx-formly/issues/1430)) ([e6560c6](https://github.com/ngx-formly/ngx-formly/commit/e6560c6)), closes [#1429](https://github.com/ngx-formly/ngx-formly/issues/1429)



<a name="5.0.0-rc.4"></a>
# [5.0.0-rc.4](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.3...v5.0.0-rc.4) (2019-02-18)


### Bug Fixes

* **core:** cleanup fields on destroy ([#1427](https://github.com/ngx-formly/ngx-formly/issues/1427)) ([b494515](https://github.com/ngx-formly/ngx-formly/commit/b494515)), closes [#1426](https://github.com/ngx-formly/ngx-formly/issues/1426)



<a name="5.0.0-rc.3"></a>
# [5.0.0-rc.3](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-rc.2...v5.0.0-rc.3) (2019-02-15)


### Bug Fixes

* **core:** display async validation message for OnPush CD ([#1419](https://github.com/ngx-formly/ngx-formly/issues/1419)) ([344b697](https://github.com/ngx-formly/ngx-formly/commit/344b697)), closes [#1417](https://github.com/ngx-formly/ngx-formly/issues/1417)
* **core:** improve managing focus with expressionProperties ([#1421](https://github.com/ngx-formly/ngx-formly/issues/1421)) ([405d8cc](https://github.com/ngx-formly/ngx-formly/commit/405d8cc)), closes [#1413](https://github.com/ngx-formly/ngx-formly/issues/1413)


### Features

* **core:** mark builder optional for FieldArrayType ([#1418](https://github.com/ngx-formly/ngx-formly/issues/1418)) ([692f84e](https://github.com/ngx-formly/ngx-formly/commit/692f84e))



<a name="5.0.0-rc.0"></a>
# [5.0.0-rc.0](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.24...v5.0.0-rc.0) (2019-02-07)

To upgrade from 4.0 to 5.0 see [UPGRADE-5.0](./UPGRADE-5.0.md)


<a name="5.0.0-beta.24"></a>
# [5.0.0-beta.24](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.23...v5.0.0-beta.24) (2019-02-03)


### Features

* **bootstrap:** add inline support for multicheckboxe and radio ([#1407](https://github.com/ngx-formly/ngx-formly/issues/1407)) ([31a5784](https://github.com/ngx-formly/ngx-formly/commit/31a5784)), closes [#1400](https://github.com/ngx-formly/ngx-formly/issues/1400)



<a name="5.0.0-beta.23"></a>
# [5.0.0-beta.23](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.22...v5.0.0-beta.23) (2019-01-20)


### Features

* **core:** export FORMLY_CONFIG ([#1392](https://github.com/ngx-formly/ngx-formly/issues/1392)) ([f793c59](https://github.com/ngx-formly/ngx-formly/commit/f793c59))



<a name="5.0.0-beta.22"></a>
# [5.0.0-beta.22](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.21...v5.0.0-beta.22) (2019-01-17)


### Bug Fixes

* **material:** add readonly and tabindex to number input ([#1383](https://github.com/ngx-formly/ngx-formly/issues/1383)) ([8c6fee7](https://github.com/ngx-formly/ngx-formly/commit/8c6fee7))
* **material:** remove duplicated readonly prop ([#1372](https://github.com/ngx-formly/ngx-formly/issues/1372)) ([34eccf5](https://github.com/ngx-formly/ngx-formly/commit/34eccf5))


### Features

* **bootstrap:** add addons to select ([#1381](https://github.com/ngx-formly/ngx-formly/issues/1381)) ([2479091](https://github.com/ngx-formly/ngx-formly/commit/2479091)), closes [#1380](https://github.com/ngx-formly/ngx-formly/issues/1380)
* **ionic:** emit int value for number input type ([008a50c](https://github.com/ngx-formly/ngx-formly/commit/008a50c))
* **kendo:** emit int value for number input type ([f53eaa5](https://github.com/ngx-formly/ngx-formly/commit/f53eaa5))
* **primeng:** emit int value for number input type ([a088477](https://github.com/ngx-formly/ngx-formly/commit/a088477))



<a name="5.0.0-beta.21"></a>
# [5.0.0-beta.21](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.20...v5.0.0-beta.21) (2018-12-28)


### Bug Fixes

* **core:** create new component instance when hostView is destroyed ([#1343](https://github.com/ngx-formly/ngx-formly/issues/1343)) ([f603676](https://github.com/ngx-formly/ngx-formly/commit/f603676))


### Features

* move defaultOptions to FieldType declaration ([#1345](https://github.com/ngx-formly/ngx-formly/issues/1345)) ([dbc9ae2](https://github.com/ngx-formly/ngx-formly/commit/dbc9ae2))



<a name="5.0.0-beta.20"></a>
# [5.0.0-beta.20](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.19...v5.0.0-beta.20) (2018-12-13)


### Bug Fixes

* **core:** add FormlyFormBuilder to child module ([#1335](https://github.com/ngx-formly/ngx-formly/issues/1335)) ([e662ac1](https://github.com/ngx-formly/ngx-formly/commit/e662ac1)), closes [#1334](https://github.com/ngx-formly/ngx-formly/issues/1334)
* **core:** avoid create field component twice ([#1340](https://github.com/ngx-formly/ngx-formly/issues/1340)) ([50ae25f](https://github.com/ngx-formly/ngx-formly/commit/50ae25f))



<a name="5.0.0-beta.19"></a>
# [5.0.0-beta.19](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.18...v5.0.0-beta.19) (2018-12-06)


### Bug Fixes

* **core:** ensure init options during buildForm ([#1333](https://github.com/ngx-formly/ngx-formly/issues/1333)) ([ee958c1](https://github.com/ngx-formly/ngx-formly/commit/ee958c1))


### Features

* **core:** deprecate manipulators in favor of extensions ([#1332](https://github.com/ngx-formly/ngx-formly/issues/1332)) ([d8ec692](https://github.com/ngx-formly/ngx-formly/commit/d8ec692))



<a name="5.0.0-beta.18"></a>
# [5.0.0-beta.18](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.17...v5.0.0-beta.18) (2018-12-03)


### Bug Fixes

* **core:** use Renderer2 instead of HostBinding ([7d1cc2c](https://github.com/ngx-formly/ngx-formly/commit/7d1cc2c))


### Features

* **material:** warn missing FieldType for a custom field type ([031f704](https://github.com/ngx-formly/ngx-formly/commit/031f704))



<a name="5.0.0-beta.17"></a>
# [5.0.0-beta.17](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.16...v5.0.0-beta.17) (2018-11-24)


### Bug Fixes

* **core:** force eval disabled expr as a boolean ([#1290](https://github.com/ngx-formly/ngx-formly/issues/1290)) ([11dfb5a](https://github.com/ngx-formly/ngx-formly/commit/11dfb5a))
* **demo:** fixed missing primeng theme ([#1289](https://github.com/ngx-formly/ngx-formly/issues/1289)) ([bf5a405](https://github.com/ngx-formly/ngx-formly/commit/bf5a405))


### Features

* allow customize required-marker style ([#1301](https://github.com/ngx-formly/ngx-formly/issues/1301)) ([fa1acad](https://github.com/ngx-formly/ngx-formly/commit/fa1acad)), closes [#1298](https://github.com/ngx-formly/ngx-formly/issues/1298)
* **core:** allow passing defaultOptions through FieldType ([#1313](https://github.com/ngx-formly/ngx-formly/issues/1313)) ([dea3b49](https://github.com/ngx-formly/ngx-formly/commit/dea3b49))
* **core:** improved typing for FieldType ([#1312](https://github.com/ngx-formly/ngx-formly/issues/1312)) ([b724e2b](https://github.com/ngx-formly/ngx-formly/commit/b724e2b))



<a name="5.0.0-beta.16"></a>
# [5.0.0-beta.16](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.15...v5.0.0-beta.16) (2018-11-13)


### Bug Fixes

* **material:** fallback to default tabindex value ([#1282](https://github.com/ngx-formly/ngx-formly/issues/1282)) ([588be37](https://github.com/ngx-formly/ngx-formly/commit/588be37)), closes [#1281](https://github.com/ngx-formly/ngx-formly/issues/1281)
* **material:** use readonly input instead of formly-attributes ([#1279](https://github.com/ngx-formly/ngx-formly/issues/1279)) ([5c1bce7](https://github.com/ngx-formly/ngx-formly/commit/5c1bce7))


### Features

* **material:** add native-select type ([#1288](https://github.com/ngx-formly/ngx-formly/issues/1288)) ([24bcac1](https://github.com/ngx-formly/ngx-formly/commit/24bcac1))
* **nativescript:** add checkbox and textarea types ([#1283](https://github.com/ngx-formly/ngx-formly/issues/1283)) ([77a5900](https://github.com/ngx-formly/ngx-formly/commit/77a5900))
* **nativescript:** add radio and select types ([#1287](https://github.com/ngx-formly/ngx-formly/issues/1287)) ([3cfedb8](https://github.com/ngx-formly/ngx-formly/commit/3cfedb8))



<a name="5.0.0-beta.15"></a>
# [5.0.0-beta.15](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.14...v5.0.0-beta.15) (2018-11-04)


### Bug Fixes

* **core:** ensure setting active injector in child module ([#1268](https://github.com/ngx-formly/ngx-formly/issues/1268)) ([84e7b71](https://github.com/ngx-formly/ngx-formly/commit/84e7b71)), closes [#1240](https://github.com/ngx-formly/ngx-formly/issues/1240)


### Features

* **core:** initial support OnPush CD ([#1267](https://github.com/ngx-formly/ngx-formly/issues/1267)) ([a874e09](https://github.com/ngx-formly/ngx-formly/commit/a874e09))


### Performance Improvements

* **core:** markForCheck only changed fields ([#1269](https://github.com/ngx-formly/ngx-formly/issues/1269)) ([44c25c9](https://github.com/ngx-formly/ngx-formly/commit/44c25c9))



<a name="5.0.0-beta.14"></a>
# [5.0.0-beta.14](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2018-11-03)


### Bug Fixes

* **core:** ensure validation error is displayed while enabling onpush CD ([#1266](https://github.com/ngx-formly/ngx-formly/issues/1266)) ([7984729](https://github.com/ngx-formly/ngx-formly/commit/7984729)), closes [#1262](https://github.com/ngx-formly/ngx-formly/issues/1262)
* **core:** ignore clone SafeHtmlImpl value ([#1257](https://github.com/ngx-formly/ngx-formly/issues/1257)) ([a7c018b](https://github.com/ngx-formly/ngx-formly/commit/a7c018b)), closes [#1254](https://github.com/ngx-formly/ngx-formly/issues/1254)
* **material:** fallback to field.type for custom FieldControlType ([#1261](https://github.com/ngx-formly/ngx-formly/issues/1261)) ([6a116f7](https://github.com/ngx-formly/ngx-formly/commit/6a116f7))
* **material:** set select aria-labelledby to avoid ExpressionCheck Error ([#1265](https://github.com/ngx-formly/ngx-formly/issues/1265)) ([41fae5c](https://github.com/ngx-formly/ngx-formly/commit/41fae5c)), closes [#1251](https://github.com/ngx-formly/ngx-formly/issues/1251)


### Features

* **ionic:** support textarea rows & cols options ([#1258](https://github.com/ngx-formly/ngx-formly/issues/1258)) ([61cd902](https://github.com/ngx-formly/ngx-formly/commit/61cd902)), closes [#1183](https://github.com/ngx-formly/ngx-formly/issues/1183)



<a name="5.0.0-beta.13"></a>
# [5.0.0-beta.13](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2018-10-25)


### Bug Fixes

* **core:** ignore cached expression value during buildForm ([#1252](https://github.com/ngx-formly/ngx-formly/issues/1252)) ([15995af](https://github.com/ngx-formly/ngx-formly/commit/15995af)), closes [#1250](https://github.com/ngx-formly/ngx-formly/issues/1250)
* **core:** take account of deprecated FormlyField inputs changes ([#1242](https://github.com/ngx-formly/ngx-formly/issues/1242)) ([3f22da8](https://github.com/ngx-formly/ngx-formly/commit/3f22da8)), closes [#1241](https://github.com/ngx-formly/ngx-formly/issues/1241)


### Features

* **core:** set peerDependency to angular >=7.0 ([#1247](https://github.com/ngx-formly/ngx-formly/issues/1247)) ([413be23](https://github.com/ngx-formly/ngx-formly/commit/413be23))



<a name="5.0.0-beta.12"></a>
# [5.0.0-beta.12](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2018-10-15)


### Features

* **core:** add form alias to the field object ([#1226](https://github.com/ngx-formly/ngx-formly/issues/1226)) ([053d72f](https://github.com/ngx-formly/ngx-formly/commit/053d72f))
* **core:** allow passing disabled prop for select options ([039a693](https://github.com/ngx-formly/ngx-formly/commit/039a693))



<a name="5.0.0-beta.11"></a>
# [5.0.0-beta.11](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2018-10-01)


### Bug Fixes

* **bootstrap:** take account of checked options for multicheckbox ([#1213](https://github.com/ngx-formly/ngx-formly/issues/1213)) ([7484599](https://github.com/ngx-formly/ngx-formly/commit/7484599)), closes [#1212](https://github.com/ngx-formly/ngx-formly/issues/1212)


### Features

* allow passing array value for multicheckbox ([#1214](https://github.com/ngx-formly/ngx-formly/issues/1214)) ([609eb39](https://github.com/ngx-formly/ngx-formly/commit/609eb39))



<a name="5.0.0-beta.10"></a>
# [5.0.0-beta.10](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.9...v5.0.0-beta.10) (2018-09-29)


### Features

* allow passing observable for multicheckbox ([#1209](https://github.com/ngx-formly/ngx-formly/issues/1209)) ([d370959](https://github.com/ngx-formly/ngx-formly/commit/d370959))
* **core:** deprecated `createControl` method in favor of `prePopulate` ([#1210](https://github.com/ngx-formly/ngx-formly/issues/1210)) ([86ee2b0](https://github.com/ngx-formly/ngx-formly/commit/86ee2b0))



<a name="5.0.0-beta.9"></a>
# [5.0.0-beta.9](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.8...v5.0.0-beta.9) (2018-09-23)


### Bug Fixes

* **bootstrap:** get correct radio value through queryselector ([#1190](https://github.com/ngx-formly/ngx-formly/issues/1190)) ([a673ba7](https://github.com/ngx-formly/ngx-formly/commit/a673ba7)), closes [#1187](https://github.com/ngx-formly/ngx-formly/issues/1187)


### Features

* **bootstrap:** use ngValue for option with 'null' for placeholder ([#1182](https://github.com/ngx-formly/ngx-formly/issues/1182)) ([d10a62b](https://github.com/ngx-formly/ngx-formly/commit/d10a62b)), closes [#1169](https://github.com/ngx-formly/ngx-formly/issues/1169)
* **core:** deprecated `lifecycle` option in favor of 'hooks' ([#1192](https://github.com/ngx-formly/ngx-formly/issues/1192)) ([891532b](https://github.com/ngx-formly/ngx-formly/commit/891532b))



<a name="5.0.0-beta.8"></a>
# [5.0.0-beta.8](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.7...v5.0.0-beta.8) (2018-09-12)


### Bug Fixes

* **core:** pass field props to lifeCycleHooks ([#1174](https://github.com/ngx-formly/ngx-formly/issues/1174)) ([f944bdb](https://github.com/ngx-formly/ngx-formly/commit/f944bdb))
* **material:** avoid define hidden prop in field templateOptions ([#1175](https://github.com/ngx-formly/ngx-formly/issues/1175)) ([c8a3e37](https://github.com/ngx-formly/ngx-formly/commit/c8a3e37))



<a name="5.0.0-beta.7"></a>
# [5.0.0-beta.7](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.6...v5.0.0-beta.7) (2018-09-12)


### Bug Fixes

* **material:** make sure input type number emits the correct value ([#1172](https://github.com/ngx-formly/ngx-formly/issues/1172)) ([e2fbee4](https://github.com/ngx-formly/ngx-formly/commit/e2fbee4))


### Features

* **core:** deprecate passing options and form input to FormlyField ([#1173](https://github.com/ngx-formly/ngx-formly/issues/1173)) ([724f594](https://github.com/ngx-formly/ngx-formly/commit/724f594))



<a name="5.0.0-beta.6"></a>
# [5.0.0-beta.6](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.5...v5.0.0-beta.6) (2018-09-06)


### Bug Fixes

* **core:** move init field validation to onPopulate hook ([#1164](https://github.com/ngx-formly/ngx-formly/issues/1164)) ([cc278b5](https://github.com/ngx-formly/ngx-formly/commit/cc278b5))


### Features

* **core:** set peerDependency to angular >=6.1 ([#1165](https://github.com/ngx-formly/ngx-formly/issues/1165)) ([67d4509](https://github.com/ngx-formly/ngx-formly/commit/67d4509))


### BREAKING CHANGES

* **core:** The library is now using Angular 6.1 and Typescript 2.9.2



<a name="5.0.0-beta.5"></a>
# [5.0.0-beta.5](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.4...v5.0.0-beta.5) (2018-08-31)


### Bug Fixes

* **core:** set enumerable to false for hidden props ([#1159](https://github.com/ngx-formly/ngx-formly/issues/1159)) ([5e9942f](https://github.com/ngx-formly/ngx-formly/commit/5e9942f)), closes [#1158](https://github.com/ngx-formly/ngx-formly/issues/1158)


### Features

* **core:** add core extension ([9ed88ae](https://github.com/ngx-formly/ngx-formly/commit/9ed88ae))
* **core:** add FieldForm extension ([b87f7fe](https://github.com/ngx-formly/ngx-formly/commit/b87f7fe))
* **core:** add FieldValidation extension ([21312bf](https://github.com/ngx-formly/ngx-formly/commit/21312bf))
* **core:** delegate field lifecycle to its component ([fcccc95](https://github.com/ngx-formly/ngx-formly/commit/fcccc95))
* **core:** deprecate fieldTransform in favor of custom extension ([3d50d96](https://github.com/ngx-formly/ngx-formly/commit/3d50d96))
* **core:** pass root field in extension hooks ([#1153](https://github.com/ngx-formly/ngx-formly/issues/1153)) ([c16c007](https://github.com/ngx-formly/ngx-formly/commit/c16c007))



<a name="5.0.0-beta.4"></a>
# [5.0.0-beta.4](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2018-08-27)


### Bug Fixes

* **bootstrap:** rely on control value for indeterminate checkbox state ([ad50e11](https://github.com/ngx-formly/ngx-formly/commit/ad50e11)), closes [#1143](https://github.com/ngx-formly/ngx-formly/issues/1143)


### Features

* **core:** move template render into separate field-type ([dccf8e2](https://github.com/ngx-formly/ngx-formly/commit/dccf8e2))



<a name="5.0.0-beta.3"></a>
# [5.0.0-beta.3](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2018-08-19)


### Bug Fixes

* **core:** hide internal component from public interface ([1f7404b](https://github.com/ngx-formly/ngx-formly/commit/1f7404b))
* **kendo:** use KENDO prefix in config name ([#1128](https://github.com/ngx-formly/ngx-formly/issues/1128)) ([7b6511a](https://github.com/ngx-formly/ngx-formly/commit/7b6511a))
* **material:** add missing id for toggle, slider and datepicker ([4569e86](https://github.com/ngx-formly/ngx-formly/commit/4569e86))


### Features

* **core:** take account of templateOptions attributes changes ([39bd41c](https://github.com/ngx-formly/ngx-formly/commit/39bd41c)), closes [#1132](https://github.com/ngx-formly/ngx-formly/issues/1132)
* **ionic:** extended v4 support ([952bca6](https://github.com/ngx-formly/ngx-formly/commit/952bca6))



<a name="5.0.0-beta.2"></a>
# [5.0.0-beta.2](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2018-08-11)


### Bug Fixes

* **core:** page flicker on fieldArray changes ([#1110](https://github.com/ngx-formly/ngx-formly/issues/1110)) ([544e25d](https://github.com/ngx-formly/ngx-formly/commit/544e25d))


### Features

* fieldArray make key optional + allow passing FormGroup ([#1114](https://github.com/ngx-formly/ngx-formly/issues/1114)) ([a6650bd](https://github.com/ngx-formly/ngx-formly/commit/a6650bd))
* take account of defaultValue for NestedForm ([#1115](https://github.com/ngx-formly/ngx-formly/issues/1115)) ([71ffe69](https://github.com/ngx-formly/ngx-formly/commit/71ffe69))
* **core:** allow modify field during build-form ([#1118](https://github.com/ngx-formly/ngx-formly/issues/1118)) ([ec9606f](https://github.com/ngx-formly/ngx-formly/commit/ec9606f))
* **core:** introduce field-expression extension ([#1119](https://github.com/ngx-formly/ngx-formly/issues/1119)) ([a18c7be](https://github.com/ngx-formly/ngx-formly/commit/a18c7be))
* **core:** rename Field to FieldType ([#1111](https://github.com/ngx-formly/ngx-formly/issues/1111)) ([0eebe96](https://github.com/ngx-formly/ngx-formly/commit/0eebe96))
* **core:** update extension config ([#1120](https://github.com/ngx-formly/ngx-formly/issues/1120)) ([5c93f5a](https://github.com/ngx-formly/ngx-formly/commit/5c93f5a))



<a name="5.0.0-beta.1"></a>
# [5.0.0-beta.1](https://github.com/ngx-formly/ngx-formly/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2018-08-08)


### Bug Fixes

* **core:** init fieldArray during assignModelToFields ([#1105](https://github.com/ngx-formly/ngx-formly/issues/1105)) ([cd2e92b](https://github.com/ngx-formly/ngx-formly/commit/cd2e92b))


### Features

* **bootstrap:** add customSelect option to select type ([#1107](https://github.com/ngx-formly/ngx-formly/issues/1107)) ([83e186c](https://github.com/ngx-formly/ngx-formly/commit/83e186c)), closes [#1100](https://github.com/ngx-formly/ngx-formly/issues/1100)
* **core:** deprecate passing 'model' input to FormlyField ([#1093](https://github.com/ngx-formly/ngx-formly/issues/1093)) ([0007cf9](https://github.com/ngx-formly/ngx-formly/commit/0007cf9))
* **core:** rerender field type on change ([#1106](https://github.com/ngx-formly/ngx-formly/issues/1106)) ([2f362d1](https://github.com/ngx-formly/ngx-formly/commit/2f362d1)), closes [#1091](https://github.com/ngx-formly/ngx-formly/issues/1091)
* **ionic:** allow customize label position ([#1096](https://github.com/ngx-formly/ngx-formly/issues/1096)) ([6a0db60](https://github.com/ngx-formly/ngx-formly/commit/6a0db60)), closes [#1092](https://github.com/ngx-formly/ngx-formly/issues/1092)



<a name="5.0.0-beta.0"></a>
# [5.0.0-beta.0](https://github.com/ngx-formly/ngx-formly/compare/v4.7.2...v5.0.0-beta.0) (2018-08-05)

To upgrade from 4.0 to 5.0 see [UPGRADE-5.0](./UPGRADE-5.0.md)

### Bug Fixes

* **core:** allow false value for legacy select-option ([5e48376](https://github.com/ngx-formly/ngx-formly/commit/5e48376))
* **core:** apply init fields type for fieldArray ([1832532](https://github.com/ngx-formly/ngx-formly/commit/1832532))
* **core:** ensure init fieldArray even if fieldGroup is not set ([b815e91](https://github.com/ngx-formly/ngx-formly/commit/b815e91))
* **core:** restore FormlyFormBuilder & FormlyConfig to forRoot module ([a3b26ca](https://github.com/ngx-formly/ngx-formly/commit/a3b26ca))
* **core:** update formcontrol validators when fields change ([63d325b](https://github.com/ngx-formly/ngx-formly/commit/63d325b)), closes [#1059](https://github.com/ngx-formly/ngx-formly/issues/1059)
* **demo:** fixed material autocomplete stackblitz example ([33f6994](https://github.com/ngx-formly/ngx-formly/commit/33f6994)), closes [#1062](https://github.com/ngx-formly/ngx-formly/issues/1062)


### Features

* **material:** move multicheckbox into a separate module ([fa49c0a](https://github.com/ngx-formly/ngx-formly/commit/fa49c0a))
* add nativescript support ([5898186](https://github.com/ngx-formly/ngx-formly/commit/5898186))
* **bootstrap:** introduce form-field wrapper ([d73c382](https://github.com/ngx-formly/ngx-formly/commit/d73c382))
* **bootstrap:** remove bootstrap v3 support ([450882d](https://github.com/ngx-formly/ngx-formly/commit/450882d)), closes [#679](https://github.com/ngx-formly/ngx-formly/issues/679)
* **bootstrap:** remove deprecated wrappers ([fabb373](https://github.com/ngx-formly/ngx-formly/commit/fabb373))
* **core:** add access to the parent field from children ([48a70d7](https://github.com/ngx-formly/ngx-formly/commit/48a70d7)), closes [#764](https://github.com/ngx-formly/ngx-formly/issues/764)
* **core:** add reset action in FieldArrayType ([db30fc3](https://github.com/ngx-formly/ngx-formly/commit/db30fc3)), closes [#1076](https://github.com/ngx-formly/ngx-formly/issues/1076)
* **core:** allow passing nested key in fieldGroup ([d90ecb8](https://github.com/ngx-formly/ngx-formly/commit/d90ecb8))
* **core:** allow passing observable in expressionProperties ([258d103](https://github.com/ngx-formly/ngx-formly/commit/258d103)), closes [#1031](https://github.com/ngx-formly/ngx-formly/issues/1031)
* **core:** apply disabled status to fieldGroup items ([6f503b9](https://github.com/ngx-formly/ngx-formly/commit/6f503b9)), closes [#844](https://github.com/ngx-formly/ngx-formly/issues/844)
* **core:** initial work for JSON Schema implementation ([b2767f4](https://github.com/ngx-formly/ngx-formly/commit/b2767f4)), closes [#1056](https://github.com/ngx-formly/ngx-formly/issues/1056)
* **core:** move formlySelectOptions pipe to core ([512caf7](https://github.com/ngx-formly/ngx-formly/commit/512caf7))
* **core:** remove deprecated fieldForm input in FormlyValidationMessage ([fe7bda3](https://github.com/ngx-formly/ngx-formly/commit/fe7bda3))
* **core:** remove lifecycle hooks in FieldType ([c431a14](https://github.com/ngx-formly/ngx-formly/commit/c431a14))
* **core:** support attr binding in formlyAttributes ([4fa306f](https://github.com/ngx-formly/ngx-formly/commit/4fa306f)), closes [#1066](https://github.com/ngx-formly/ngx-formly/issues/1066)
* **core:** use the new providedIn with better lazyload support ([4325e40](https://github.com/ngx-formly/ngx-formly/commit/4325e40))
* **material:** move textarea into a separate module ([6bb9e09](https://github.com/ngx-formly/ngx-formly/commit/6bb9e09))
* **schematics:** add nativescript ([91d42df](https://github.com/ngx-formly/ngx-formly/commit/91d42df))
* allow passing observable for radio options ([10ae8af](https://github.com/ngx-formly/ngx-formly/commit/10ae8af))
* migrate from ionic-angular to [@ionic](https://github.com/ionic)/angular ([0b48dca](https://github.com/ngx-formly/ngx-formly/commit/0b48dca))


### BREAKING CHANGES

* see [UPGRADE-5.0](./UPGRADE-5.0.md)



<a name="4.7.2"></a>
## [4.7.2](https://github.com/ngx-formly/ngx-formly/compare/v4.7.1...v4.7.2) (2018-08-07)


### Bug Fixes

* **bootstrap:** ensure using angular multi-select selector ([5bc50c8](https://github.com/ngx-formly/ngx-formly/commit/5bc50c8)), closes [#1094](https://github.com/ngx-formly/ngx-formly/issues/1094)



<a name="4.7.1"></a>
## [4.7.1](https://github.com/ngx-formly/ngx-formly/compare/v4.7.0...v4.7.1) (2018-08-01)


### Bug Fixes

* **core:** avoid setting wrapper while init type-config ([0371180](https://github.com/ngx-formly/ngx-formly/commit/0371180))



<a name="4.7.0"></a>
# [4.7.0](https://github.com/ngx-formly/ngx-formly/compare/v4.6.6...v4.7.0) (2018-08-01)


### Features

* **bootstrap:** deprecate all wrappers in favor of `form-field` ([03c7e4b](https://github.com/ngx-formly/ngx-formly/commit/03c7e4b))
* **bootstrap:** introduce form-field wrapper ([8a276fb](https://github.com/ngx-formly/ngx-formly/commit/8a276fb))



<a name="4.6.6"></a>
## [4.6.6](https://github.com/ngx-formly/ngx-formly/compare/v4.6.5...v4.6.6) (2018-07-20)

* **core:** Revert "perf(core): check expression change only when expression is set"

<a name="4.6.5"></a>
## [4.6.5](https://github.com/ngx-formly/ngx-formly/compare/v4.6.4...v4.6.5) (2018-07-18)


### Bug Fixes

* **core:** avoid merging array in reverseDeepMerge ([1ab4e11](https://github.com/ngx-formly/ngx-formly/commit/1ab4e11))
* **core:** init fields options before assignModelToFields ([9a322e6](https://github.com/ngx-formly/ngx-formly/commit/9a322e6))



<a name="4.6.4"></a>
## [4.6.4](https://github.com/ngx-formly/ngx-formly/compare/v4.6.3...v4.6.4) (2018-07-12)


### Performance Improvements

* **core:** check expression change only when expression is set ([f30ac9a](https://github.com/ngx-formly/ngx-formly/commit/f30ac9a))



<a name="4.6.3"></a>
## [4.6.3](https://github.com/ngx-formly/ngx-formly/compare/v4.6.2...v4.6.3) (2018-06-28)


### Bug Fixes

* **material:** ensure focus field elm on container click ([b5f195b](https://github.com/ngx-formly/ngx-formly/commit/b5f195b))



<a name="4.6.2"></a>
## [4.6.2](https://github.com/ngx-formly/ngx-formly/compare/v4.6.1...v4.6.2) (2018-06-27)


### Bug Fixes

* **core:** remove passing model value to FormGroup ([#1021](https://github.com/ngx-formly/ngx-formly/issues/1021)) ([f0f7e2c](https://github.com/ngx-formly/ngx-formly/commit/f0f7e2c))



<a name="4.6.1"></a>
## [4.6.1](https://github.com/ngx-formly/ngx-formly/compare/v4.6.0...v4.6.1) (2018-06-27)


### Bug Fixes

* **core:** ensure passing a valid model for FormGroup instance ([f512ebb](https://github.com/ngx-formly/ngx-formly/commit/f512ebb)), closes [#1019](https://github.com/ngx-formly/ngx-formly/issues/1019)



<a name="4.6.0"></a>
# [4.6.0](https://github.com/ngx-formly/ngx-formly/compare/v4.5.0...v4.6.0) (2018-06-27)


### Features

* **bootstrap:** allow passing function for labelProp and valueProp ([9a658a4](https://github.com/ngx-formly/ngx-formly/commit/9a658a4))
* **material:** allow passing function for labelProp and valueProp ([667ac50](https://github.com/ngx-formly/ngx-formly/commit/667ac50)), closes [#982](https://github.com/ngx-formly/ngx-formly/issues/982)
* **material:** support compareWith input for select type ([2f17694](https://github.com/ngx-formly/ngx-formly/commit/2f17694)), closes [#982](https://github.com/ngx-formly/ngx-formly/issues/982)



<a name="4.5.0"></a>
# [4.5.0](https://github.com/ngx-formly/ngx-formly/compare/v4.4.6...v4.5.0) (2018-06-21)


### Features

* **core:** allow specify the target of a validation error ([d2105f7](https://github.com/ngx-formly/ngx-formly/commit/d2105f7)), closes [#1007](https://github.com/ngx-formly/ngx-formly/issues/1007)



<a name="4.4.6"></a>
## [4.4.6](https://github.com/ngx-formly/ngx-formly/compare/v4.4.5...v4.4.6) (2018-06-18)


### Bug Fixes

* **bootstrap:** allow disabling the default templateManipulator wrappers ([6a82e8b](https://github.com/ngx-formly/ngx-formly/commit/6a82e8b)), closes [#1003](https://github.com/ngx-formly/ngx-formly/issues/1003)



<a name="4.4.5"></a>
## [4.4.5](https://github.com/ngx-formly/ngx-formly/compare/v4.4.4...v4.4.5) (2018-06-18)


### Bug Fixes

* **core:** avoid duplicate templateManipulator wrapper during rebuild ([291d214](https://github.com/ngx-formly/ngx-formly/commit/291d214)), closes [#997](https://github.com/ngx-formly/ngx-formly/issues/997)



<a name="4.4.4"></a>
## [4.4.4](https://github.com/ngx-formly/ngx-formly/compare/v4.4.3...v4.4.4) (2018-06-07)


### Bug Fixes

* **core:** avoid passing a number path when handling hideExpression ([edabd82](https://github.com/ngx-formly/ngx-formly/commit/edabd82)), closes [#981](https://github.com/ngx-formly/ngx-formly/issues/981)


### Features

* **core:** add schematics ([9855ecb](https://github.com/ngx-formly/ngx-formly/commit/9855ecb))



<a name="4.4.3"></a>
## [4.4.3](https://github.com/ngx-formly/ngx-formly/compare/v4.4.2...v4.4.3) (2018-06-06)


### Bug Fixes

* **core:** update field model when assigning a new model ([727e7d5](https://github.com/ngx-formly/ngx-formly/commit/727e7d5)), closes [#975](https://github.com/ngx-formly/ngx-formly/issues/975)



<a name="4.4.2"></a>
## [4.4.2](https://github.com/ngx-formly/ngx-formly/compare/v4.4.1...v4.4.2) (2018-06-02)


### Bug Fixes

* **material:** recalculate the gap size after displaying field ([58c3fe8](https://github.com/ngx-formly/ngx-formly/commit/58c3fe8))



<a name="4.4.1"></a>
## [4.4.1](https://github.com/ngx-formly/ngx-formly/compare/v4.4.0...v4.4.1) (2018-06-01)


### Bug Fixes

* **core:** ensure tracking model change after reseting model ([840661d](https://github.com/ngx-formly/ngx-formly/commit/840661d)), closes [#969](https://github.com/ngx-formly/ngx-formly/issues/969)



<a name="4.4.0"></a>
# [4.4.0](https://github.com/ngx-formly/ngx-formly/compare/v4.3.0...v4.4.0) (2018-05-30)


### Features

* **material:** update datepicker to support min max ([1e7d92c](https://github.com/ngx-formly/ngx-formly/commit/1e7d92c))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/ngx-formly/ngx-formly/compare/v4.2.0...v4.3.0) (2018-05-25)


### Features

* **material:** move types into separate entry points ([32671b7](https://github.com/ngx-formly/ngx-formly/commit/32671b7))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/ngx-formly/ngx-formly/compare/v4.1.0...v4.2.0) (2018-05-21)


### Features

* **core:** add `updateOn` to `modelOptions` ([2f9f3a3](https://github.com/ngx-formly/ngx-formly/commit/2f9f3a3))
* **material:** allow setting custom appearance and color ([69b3ae7](https://github.com/ngx-formly/ngx-formly/commit/69b3ae7))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/ngx-formly/ngx-formly/compare/v4.0.3...v4.1.0) (2018-05-18)


### Features

* add grouped select support when binding observables ([0f903c7](https://github.com/ngx-formly/ngx-formly/commit/0f903c7))



<a name="4.0.3"></a>
## [4.0.3](https://github.com/ngx-formly/ngx-formly/compare/v4.0.2...v4.0.3) (2018-05-15)


### Bug Fixes

* **core:** export FormlyTemplateOptions ([7953c1d](https://github.com/ngx-formly/ngx-formly/commit/7953c1d)), closes [#950](https://github.com/ngx-formly/ngx-formly/issues/950)



<a name="4.0.2"></a>
## [4.0.2](https://github.com/ngx-formly/ngx-formly/compare/v4.0.1...v4.0.2) (2018-05-13)


### Bug Fixes

* **core:** create field component before calling onInit lifecycle ([b3923f2](https://github.com/ngx-formly/ngx-formly/commit/b3923f2))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/ngx-formly/ngx-formly/compare/v4.0.0...v4.0.1) (2018-05-09)


### Bug Fixes

* **core:** keep Observable value in clone ([bcb4bb4](https://github.com/ngx-formly/ngx-formly/commit/bcb4bb4))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/ngx-formly/ngx-formly/compare/v3.1.0...v4.0.0) (2018-05-06)


### Features

* add angular & rxjs 6.0 support ([00587d0](https://github.com/ngx-formly/ngx-formly/commit/00587d0))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/ngx-formly/ngx-formly/compare/v3.0.3...v3.1.0) (2018-05-06)


### Bug Fixes

* **core:** ensure using a valid formcontrol in FieldArrayType:add ([90d7cf7](https://github.com/ngx-formly/ngx-formly/commit/90d7cf7))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/ngx-formly/ngx-formly/compare/v3.0.2...v3.0.3) (2018-05-04)


### Bug Fixes

* **core:** move building pre/post wrapper into FormBuilder ([#938](https://github.com/ngx-formly/ngx-formly/issues/938)) ([711e418](https://github.com/ngx-formly/ngx-formly/commit/711e418)), closes [#925](https://github.com/ngx-formly/ngx-formly/issues/925)
* **material:** avoid using deprecated align input for checkbox ([#937](https://github.com/ngx-formly/ngx-formly/issues/937)) ([6ab6109](https://github.com/ngx-formly/ngx-formly/commit/6ab6109))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/ngx-formly/ngx-formly/compare/v3.0.1...v3.0.2) (2018-05-03)


### Bug Fixes

* **core:** ensure parsers is working again ([#933](https://github.com/ngx-formly/ngx-formly/issues/933)) ([3a3e478](https://github.com/ngx-formly/ngx-formly/commit/3a3e478))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/ngx-formly/ngx-formly/compare/v3.0.0...v3.0.1) (2018-05-02)


### Bug Fixes

* **core:** allow using validation with custom validator ([#928](https://github.com/ngx-formly/ngx-formly/issues/928)) ([116c6ec](https://github.com/ngx-formly/ngx-formly/commit/116c6ec)), closes [#926](https://github.com/ngx-formly/ngx-formly/issues/926)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/ngx-formly/ngx-formly/compare/v3.0.0-alpha.2...v3.0.0) (2018-04-28)


### Features

* **core:** deprecate passing 'fieldForm' in formly-validation-message ([bfd014e](https://github.com/ngx-formly/ngx-formly/commit/bfd014e))



<a name="3.0.0-alpha.2"></a>
# [3.0.0-alpha.2](https://github.com/ngx-formly/ngx-formly/compare/v2.1.1...v3.0.0-alpha.2) (2018-04-26)

### Features

* **core:** allow access to the model from the field ([b5034f2](https://github.com/ngx-formly/ngx-formly/commit/b5034f2))
* **core:** move createControl FieldArrayType to core ([883a63c](https://github.com/ngx-formly/ngx-formly/commit/883a63c)), closes [#909](https://github.com/ngx-formly/ngx-formly/issues/909)


### BREAKING CHANGES

* **core:** createControl in FieldArrayType has been removed

<a name="3.0.0-alpha.1"></a>
# [3.0.0-alpha.1](https://github.com/ngx-formly/ngx-formly/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2018-04-23)


### Bug Fixes

* **material:** use default entryFile ([9032911](https://github.com/ngx-formly/ngx-formly/commit/9032911))


### Features

* **core:** remove deprecated 'field.' path in `expressionProperties` ([b23e546](https://github.com/ngx-formly/ngx-formly/commit/b23e546))
* **core:** remove passing formControl for formlyAttributes events ([4d4f894](https://github.com/ngx-formly/ngx-formly/commit/4d4f894))
* **material:** remove deprecated floatPlaceholder ([3a57aca](https://github.com/ngx-formly/ngx-formly/commit/3a57aca))
* **material:** remove deprecated focusMonitor method ([8c09639](https://github.com/ngx-formly/ngx-formly/commit/8c09639))


### BREAKING CHANGES

* **core:** Passing `formControl` as a second argument for (focus, blur, keyup, keydown, click, change, keypress) events is removed rely on `field.formControl` instead.

  Before:
    ```ts
    keypress: (field, formControl) => { console.log(formControl.value); },
    ```

  After:
    ```ts
    keypress: (field, event) => { console.log(field.formControl.value); },
    ```

* **core:** Using `field.prop` path in `expressionProperties` is removed, use `prop` instead.

  Before:
    ```ts
    expressionProperties = {
      'field.className': ...
    }
    ```

  After:
    ```ts
    expressionProperties = {
      'className': ...
    }
    ```

* **material:** FormlyWrapperFormField::focusMonitor is removed
* **material:** the deprecated `floatPlaceholder` option is replaced by `floatLabel`

  Before:
    ```ts
    templateOptions: {
      floatPlaceholder: ...
    }
    ```

  After:
    ```ts
    templateOptions: {
      floatLabel: ...
    }
    ```

<a name="3.0.0-alpha.0"></a>
# [3.0.0-alpha.0](https://github.com/ngx-formly/ngx-formly/compare/v2.1.1...v3.0.0-alpha.0) (2018-04-21)


### Features

* **core:** move managing lifeCycle hooks to `formly-field` component ([#872](https://github.com/ngx-formly/ngx-formly/issues/872)) ([40a6e6c](https://github.com/ngx-formly/ngx-formly/commit/40a6e6c)), closes [#643](https://github.com/ngx-formly/ngx-formly/issues/643)
* **core:** remove `formControl` input in FormlyAttributes ([#862](https://github.com/ngx-formly/ngx-formly/issues/862)) ([5c41bdc](https://github.com/ngx-formly/ngx-formly/commit/5c41bdc)), closes [#642](https://github.com/ngx-formly/ngx-formly/issues/642)
* **core:** use rxjs lettable operators. ([#857](https://github.com/ngx-formly/ngx-formly/issues/857)) ([a2e79bd](https://github.com/ngx-formly/ngx-formly/commit/a2e79bd))
* **ionic:** initial work for ui-ionic support ([#659](https://github.com/ngx-formly/ngx-formly/issues/659)) ([31d732b](https://github.com/ngx-formly/ngx-formly/commit/31d732b))
* initial work for kendo support ([#897](https://github.com/ngx-formly/ngx-formly/issues/897)) ([df6551d](https://github.com/ngx-formly/ngx-formly/commit/df6551d)), closes [#599](https://github.com/ngx-formly/ngx-formly/issues/599)
* initial work for primeng support ([#887](https://github.com/ngx-formly/ngx-formly/issues/887)) ([40ca63f](https://github.com/ngx-formly/ngx-formly/commit/40ca63f))
* **material:** add auto-Complete type example ([273447b](https://github.com/ngx-formly/ngx-formly/commit/273447b)), closes [#615](https://github.com/ngx-formly/ngx-formly/issues/615)
* **material:** add slider type ([70019ca](https://github.com/ngx-formly/ngx-formly/commit/70019ca))
* **material:** add toggle type ([7a39efc](https://github.com/ngx-formly/ngx-formly/commit/7a39efc))
* **material:** implement DatePicker type ([#873](https://github.com/ngx-formly/ngx-formly/issues/873)) ([b5b5c18](https://github.com/ngx-formly/ngx-formly/commit/b5b5c18)), closes [#614](https://github.com/ngx-formly/ngx-formly/issues/614)


### BREAKING CHANGES

* **core:** `formControl` has been removed in `[formlyAttributes]` directive.
* **core:** droped Angular 4 support + rxjs version should >= 5.5.8



<a name="2.1.1"></a>
## [2.1.1](https://github.com/ngx-formly/ngx-formly/compare/v2.1.0...v2.1.1) (2018-04-21)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/ngx-formly/ngx-formly/compare/v2.0.1...v2.1.0) (2018-04-21)


### Features

* **core:** pass field instance into ValidatorOption callback ([#898](https://github.com/ngx-formly/ngx-formly/issues/898)) ([0233d41](https://github.com/ngx-formly/ngx-formly/commit/0233d41))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0...v2.0.1) (2018-04-18)


### Bug Fixes

* **core:** do not force using FormGroup when FieldArray is set. ([#894](https://github.com/ngx-formly/ngx-formly/issues/894)) ([cb16156](https://github.com/ngx-formly/ngx-formly/commit/cb16156)), closes [#890](https://github.com/ngx-formly/ngx-formly/issues/890)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.55...v2.0.0) (2018-04-15)

To upgrade from ng-formly to @ngx-formly/core see [UPGRADE-2.0](./UPGRADE-2.0.md)

<a name="2.0.0-rc.55"></a>
# [2.0.0-rc.55](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.54...v2.0.0-rc.55) (2018-04-11)


### Bug Fixes

* **bootstrap:** apply border radius for input when using addons ([#882](https://github.com/ngx-formly/ngx-formly/issues/882)) ([cc3b168](https://github.com/ngx-formly/ngx-formly/commit/cc3b168)), closes [#656](https://github.com/ngx-formly/ngx-formly/issues/656)
* **core:** take account of hidden fields when reseting model. ([#883](https://github.com/ngx-formly/ngx-formly/issues/883)) ([2eeae7a](https://github.com/ngx-formly/ngx-formly/commit/2eeae7a)), closes [#881](https://github.com/ngx-formly/ngx-formly/issues/881)
* **core:** use `Field` instead `FormlyFieldConfig` in showError ([#878](https://github.com/ngx-formly/ngx-formly/issues/878)) ([f84252e](https://github.com/ngx-formly/ngx-formly/commit/f84252e)), closes [#877](https://github.com/ngx-formly/ngx-formly/issues/877)



<a name="2.0.0-rc.54"></a>
# [2.0.0-rc.54](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.53...v2.0.0-rc.54) (2018-04-07)


### Features

* **core:** pass event instead of formControl to FormlyAttributes events. ([#870](https://github.com/ngx-formly/ngx-formly/issues/870)) ([2bcc875](https://github.com/ngx-formly/ngx-formly/commit/2bcc875)), closes [#867](https://github.com/ngx-formly/ngx-formly/issues/867)

### Deprecations

* Passing `formControl` as a second argument for (focus, blur, keyup, keydown, click, change, keypress) events is deprecated and it will be removed in the 3.0 version, use `field.formControl` instead.

  Before:
    ```ts
    keypress: (field, formControl) => { console.log(formControl.value); },
    ```

  After:
    ```ts
    keypress: (field) => { console.log(field.formControl.value); },
    ```

* Using `field.prop` path in `expressionProperties` is deprecated, use `prop` instead.

  Before:
    ```ts
    expressionProperties = {
      'field.className': ...
    }
    ```

  After:
    ```ts
    expressionProperties = {
      'className': ...
    }
    ```

<a name="2.0.0-rc.53"></a>
# [2.0.0-rc.53](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.52...v2.0.0-rc.53) (2018-04-06)



<a name="2.0.0-rc.52"></a>
# [2.0.0-rc.52](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.51...v2.0.0-rc.52) (2018-04-06)


### Features

* **core:** allow passing the index and the initial model for FieldArrayType::add method. ([#869](https://github.com/ngx-formly/ngx-formly/issues/869)) ([93f5eab](https://github.com/ngx-formly/ngx-formly/commit/93f5eab)), closes [#866](https://github.com/ngx-formly/ngx-formly/issues/866)



<a name="2.0.0-rc.51"></a>
# [2.0.0-rc.51](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.50...v2.0.0-rc.51) (2018-04-04)


### Features

* **code:** allow using key expression property without passing `field` path. ([#863](https://github.com/ngx-formly/ngx-formly/issues/863)) ([809fced](https://github.com/ngx-formly/ngx-formly/commit/809fced))



<a name="2.0.0-rc.50"></a>
# [2.0.0-rc.50](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.49...v2.0.0-rc.50) (2018-03-30)


### Bug Fixes

* **core:** remove hide field to force re-evalute it in FormlyFormExpression. ([#852](https://github.com/ngx-formly/ngx-formly/issues/852)) ([333af5f](https://github.com/ngx-formly/ngx-formly/commit/333af5f))
* **core:** toggle disabled state when disabled property is changed. ([442701d](https://github.com/ngx-formly/ngx-formly/commit/442701d)), closes [#851](https://github.com/ngx-formly/ngx-formly/issues/851)



<a name="2.0.0-rc.49"></a>
# [2.0.0-rc.49](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.48...v2.0.0-rc.49) (2018-03-27)


### Bug Fixes

* **core:** apply disabled status to child field when fieldGroup is set. ([#847](https://github.com/ngx-formly/ngx-formly/issues/847)) ([5ddd53a](https://github.com/ngx-formly/ngx-formly/commit/5ddd53a)), closes [#844](https://github.com/ngx-formly/ngx-formly/issues/844)



<a name="2.0.0-rc.48"></a>
# [2.0.0-rc.48](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.47...v2.0.0-rc.48) (2018-03-27)


### Bug Fixes

* **core:** remove aria-describedby ([#835](https://github.com/ngx-formly/ngx-formly/issues/835)) ([02e9d2e](https://github.com/ngx-formly/ngx-formly/commit/02e9d2e)), closes [#760](https://github.com/ngx-formly/ngx-formly/issues/760)


### Features

* **core:** Added ng-content to formly-group. Updated Examples to inline remove button of repeating section  ([#840](https://github.com/ngx-formly/ngx-formly/issues/840)) ([2a19867](https://github.com/ngx-formly/ngx-formly/commit/2a19867))
* **docs:** add validation + expression-properties section. ([#836](https://github.com/ngx-formly/ngx-formly/issues/836)) ([3f5fff0](https://github.com/ngx-formly/ngx-formly/commit/3f5fff0))



<a name="2.0.0-rc.47"></a>
# [2.0.0-rc.47](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.46...v2.0.0-rc.47) (2018-03-25)


### Bug Fixes

* **core:** allow passing falsy value for hideExpression. ([#833](https://github.com/ngx-formly/ngx-formly/issues/833)) ([7469a2a](https://github.com/ngx-formly/ngx-formly/commit/7469a2a)), closes [#832](https://github.com/ngx-formly/ngx-formly/issues/832)



<a name="2.0.0-rc.46"></a>
# [2.0.0-rc.46](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.45...v2.0.0-rc.46) (2018-03-23)


### Bug Fixes

* **core:** subscribe to formcontrol when key and type are set. ([#829](https://github.com/ngx-formly/ngx-formly/issues/829)) ([eb2db0f](https://github.com/ngx-formly/ngx-formly/commit/eb2db0f)), closes [#827](https://github.com/ngx-formly/ngx-formly/issues/827)



<a name="2.0.0-rc.45"></a>
# [2.0.0-rc.45](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.44...v2.0.0-rc.45) (2018-03-22)


### Bug Fixes

* **bootstrap:** always enable description + validation for templateManipulators. ([#826](https://github.com/ngx-formly/ngx-formly/issues/826)) ([edecf76](https://github.com/ngx-formly/ngx-formly/commit/edecf76))



<a name="2.0.0-rc.44"></a>
# [2.0.0-rc.44](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.43...v2.0.0-rc.44) (2018-03-21)


### Bug Fixes

* **core:** ensure tracking model changes when using Repeating section. ([33ab0a9](https://github.com/ngx-formly/ngx-formly/commit/33ab0a9)), closes [#821](https://github.com/ngx-formly/ngx-formly/issues/821) [#822](https://github.com/ngx-formly/ngx-formly/issues/822)



<a name="2.0.0-rc.43"></a>
# [2.0.0-rc.43](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.42...v2.0.0-rc.43) (2018-03-17)


### Bug Fixes

* **core:** fallback to null for an non-existing member on model change. ([e332485](https://github.com/ngx-formly/ngx-formly/commit/e332485)), closes [#805](https://github.com/ngx-formly/ngx-formly/issues/805)


### Performance Improvements

* **core:** check field expression only in root component. ([#811](https://github.com/ngx-formly/ngx-formly/issues/811)) ([495eb9b](https://github.com/ngx-formly/ngx-formly/commit/495eb9b))
* **core:** do not emit `modelChange` on model-input change. ([20cc4b9](https://github.com/ngx-formly/ngx-formly/commit/20cc4b9))



<a name="2.0.0-rc.42"></a>
# [2.0.0-rc.42](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.41...v2.0.0-rc.42) (2018-03-16)


### Bug Fixes

* **core:** move tracking model change to root component. ([#809](https://github.com/ngx-formly/ngx-formly/issues/809)) ([0410653](https://github.com/ngx-formly/ngx-formly/commit/0410653)), closes [#805](https://github.com/ngx-formly/ngx-formly/issues/805)


### Performance Improvements

* **core:** avoid calling setControl if control already exist in form. ([#810](https://github.com/ngx-formly/ngx-formly/issues/810)) ([8898389](https://github.com/ngx-formly/ngx-formly/commit/8898389))



<a name="2.0.0-rc.41"></a>
# [2.0.0-rc.41](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.40...v2.0.0-rc.41) (2018-03-14)


### Bug Fixes

* **core:** avoid initializing FormlyGroup twice. ([#803](https://github.com/ngx-formly/ngx-formly/issues/803)) ([28cfbd9](https://github.com/ngx-formly/ngx-formly/commit/28cfbd9))



<a name="2.0.0-rc.40"></a>
# [2.0.0-rc.40](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.39...v2.0.0-rc.40) (2018-03-13)


### Bug Fixes

* **core:** `addFormControl` apply patchValue only for FormControl instance. ([#799](https://github.com/ngx-formly/ngx-formly/issues/799)) ([dde0c14](https://github.com/ngx-formly/ngx-formly/commit/dde0c14))
* **core:** call the `parentForm.reset` only if it match the current form. ([#798](https://github.com/ngx-formly/ngx-formly/issues/798)) ([222c3a0](https://github.com/ngx-formly/ngx-formly/commit/222c3a0)), closes [#796](https://github.com/ngx-formly/ngx-formly/issues/796)
* **core:** use patch method instead of reset when model change. ([#797](https://github.com/ngx-formly/ngx-formly/issues/797)) ([ed6e7ba](https://github.com/ngx-formly/ngx-formly/commit/ed6e7ba)), closes [#794](https://github.com/ngx-formly/ngx-formly/issues/794)



<a name="2.0.0-rc.39"></a>
# [2.0.0-rc.39](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.38...v2.0.0-rc.39) (2018-03-12)


### Bug Fixes

* **core:** rebuild fields when `form` change. ([#789](https://github.com/ngx-formly/ngx-formly/issues/789)) ([1ff5d00](https://github.com/ngx-formly/ngx-formly/commit/1ff5d00)), closes [#788](https://github.com/ngx-formly/ngx-formly/issues/788)



<a name="2.0.0-rc.38"></a>
# [2.0.0-rc.38](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.37...v2.0.0-rc.38) (2018-03-11)


### Bug Fixes

* **core:** change `submitted` state on resetForm. ([#786](https://github.com/ngx-formly/ngx-formly/issues/786)) ([426ce5b](https://github.com/ngx-formly/ngx-formly/commit/426ce5b)), closes [#785](https://github.com/ngx-formly/ngx-formly/issues/785)
* **core:** take account of model changes for an existent field form. ([#784](https://github.com/ngx-formly/ngx-formly/issues/784)) ([35fe7c5](https://github.com/ngx-formly/ngx-formly/commit/35fe7c5)), closes [#782](https://github.com/ngx-formly/ngx-formly/issues/782)
* **core:** take account of model changes when fields is already builded. ([#787](https://github.com/ngx-formly/ngx-formly/issues/787)) ([73b85b4](https://github.com/ngx-formly/ngx-formly/commit/73b85b4))



<a name="2.0.0-rc.37"></a>
# [2.0.0-rc.37](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.36...v2.0.0-rc.37) (2018-03-09)


### Bug Fixes

* **core:** avoid reset parent form when resetting model. ([#783](https://github.com/ngx-formly/ngx-formly/issues/783)) ([1757193](https://github.com/ngx-formly/ngx-formly/commit/1757193))



<a name="2.0.0-rc.36"></a>
# [2.0.0-rc.36](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.35...v2.0.0-rc.36) (2018-03-08)


### Bug Fixes

* **core:** ensure options is initialized during build. ([#779](https://github.com/ngx-formly/ngx-formly/issues/779)) ([f7147e0](https://github.com/ngx-formly/ngx-formly/commit/f7147e0)), closes [#774](https://github.com/ngx-formly/ngx-formly/issues/774)
* **core:** reset model on each change ([#770](https://github.com/ngx-formly/ngx-formly/issues/770)) ([cd78b60](https://github.com/ngx-formly/ngx-formly/commit/cd78b60))


### Features

* **core:** allow binding Observables to select options ([#772](https://github.com/ngx-formly/ngx-formly/issues/772)) ([7307e02](https://github.com/ngx-formly/ngx-formly/commit/7307e02))



<a name="2.0.0-rc.35"></a>
# [2.0.0-rc.35](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.34...v2.0.0-rc.35) (2018-03-02)


### Bug Fixes

* **core:** take account of RegExp in clone. ([#766](https://github.com/ngx-formly/ngx-formly/issues/766)) ([6489561](https://github.com/ngx-formly/ngx-formly/commit/6489561)), closes [#763](https://github.com/ngx-formly/ngx-formly/issues/763)



<a name="2.0.0-rc.34"></a>
# [2.0.0-rc.34](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.33...v2.0.0-rc.34) (2018-02-28)


### Bug Fixes

* **core:** set empty array as defaultValue when fieldArray is set. ([#762](https://github.com/ngx-formly/ngx-formly/issues/762)) ([2567886](https://github.com/ngx-formly/ngx-formly/commit/2567886)), closes [#761](https://github.com/ngx-formly/ngx-formly/issues/761)



<a name="2.0.0-rc.33"></a>
# [2.0.0-rc.33](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.32...v2.0.0-rc.33) (2018-02-28)


### Bug Fixes

* **bootstrap:** show error message when asyncValidators is set. ([#759](https://github.com/ngx-formly/ngx-formly/issues/759)) ([cb5e980](https://github.com/ngx-formly/ngx-formly/commit/cb5e980)), closes [#757](https://github.com/ngx-formly/ngx-formly/issues/757)
* **demo:** take account of model changes in example-viewer. ([#755](https://github.com/ngx-formly/ngx-formly/issues/755)) ([15b4c48](https://github.com/ngx-formly/ngx-formly/commit/15b4c48)), closes [#754](https://github.com/ngx-formly/ngx-formly/issues/754)



<a name="2.0.0-rc.32"></a>
# [2.0.0-rc.32](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.31...v2.0.0-rc.32) (2018-02-24)


### Bug Fixes

* **core:** rely on `__build__` to check expression instead of parentFormlyForm. ([#751](https://github.com/ngx-formly/ngx-formly/issues/751)) ([886dad9](https://github.com/ngx-formly/ngx-formly/commit/886dad9)), closes [#745](https://github.com/ngx-formly/ngx-formly/issues/745)
* **core:** reset FormArray when resetting model. ([#750](https://github.com/ngx-formly/ngx-formly/issues/750)) ([e37ae81](https://github.com/ngx-formly/ngx-formly/commit/e37ae81)), closes [#648](https://github.com/ngx-formly/ngx-formly/issues/648)


### Features

* **core:** introduce FieldArrayType to simplify managing repeating fields. ([#749](https://github.com/ngx-formly/ngx-formly/issues/749)) ([90dd1da](https://github.com/ngx-formly/ngx-formly/commit/90dd1da))
* **formly-form:** allow passing FormArray in form input. ([#748](https://github.com/ngx-formly/ngx-formly/issues/748)) ([76938a8](https://github.com/ngx-formly/ngx-formly/commit/76938a8))



<a name="2.0.0-rc.31"></a>
# [2.0.0-rc.31](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.30...v2.0.0-rc.31) (2018-02-22)


### Bug Fixes

* **core:** only read attributes property if templateOptions are set ([#744](https://github.com/ngx-formly/ngx-formly/issues/744)) ([0843b11](https://github.com/ngx-formly/ngx-formly/commit/0843b11))
* **FormlyFormExpression:** ensure ParentFormControl is set when for check field visibility. ([#743](https://github.com/ngx-formly/ngx-formly/issues/743)) ([d8d7b27](https://github.com/ngx-formly/ngx-formly/commit/d8d7b27))



<a name="2.0.0-rc.30"></a>
# [2.0.0-rc.30](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.29...v2.0.0-rc.30) (2018-02-21)


### Bug Fixes

* **bootstrap:** avoid displaying blank field in select. ([#742](https://github.com/ngx-formly/ngx-formly/issues/742)) ([c2c23ef](https://github.com/ngx-formly/ngx-formly/commit/c2c23ef)), closes [#739](https://github.com/ngx-formly/ngx-formly/issues/739)
* **core:** ignore built-in validations only when passing false value. ([#740](https://github.com/ngx-formly/ngx-formly/issues/740)) ([f29538a](https://github.com/ngx-formly/ngx-formly/commit/f29538a)), closes [#729](https://github.com/ngx-formly/ngx-formly/issues/729)


### Features

* **bootstrap, material:** allow removing the required asterisk symbol. ([#741](https://github.com/ngx-formly/ngx-formly/issues/741)) ([0060633](https://github.com/ngx-formly/ngx-formly/commit/0060633)), closes [#738](https://github.com/ngx-formly/ngx-formly/issues/738)
* **core:** allow rendering extra attributes ([#736](https://github.com/ngx-formly/ngx-formly/issues/736)) ([59b0034](https://github.com/ngx-formly/ngx-formly/commit/59b0034))



<a name="2.0.0-rc.29"></a>
# [2.0.0-rc.29](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.28...v2.0.0-rc.29) (2018-02-20)


### Bug Fixes

* **bootstrap:** don't render label when the templateOption is not set ([#734](https://github.com/ngx-formly/ngx-formly/issues/734)) ([8f30bb2](https://github.com/ngx-formly/ngx-formly/commit/8f30bb2))
* **FormlyFormExpression:** ensure toggling formControl when key contains array syntax ([#735](https://github.com/ngx-formly/ngx-formly/issues/735)) ([58f25b7](https://github.com/ngx-formly/ngx-formly/commit/58f25b7))



<a name="2.0.0-rc.28"></a>
# [2.0.0-rc.28](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.27...v2.0.0-rc.28) (2018-02-19)


### Bug Fixes

* **bootstrap:** ensure emitting an int value for number input type. ([#730](https://github.com/ngx-formly/ngx-formly/issues/730)) ([8a30092](https://github.com/ngx-formly/ngx-formly/commit/8a30092)), closes [#729](https://github.com/ngx-formly/ngx-formly/issues/729)
* **core:** ensure emitting modelChange for nested field groups. ([#728](https://github.com/ngx-formly/ngx-formly/issues/728)) ([21c3e2a](https://github.com/ngx-formly/ngx-formly/commit/21c3e2a))


### Features

* **core:** add support for readonly property. ([#733](https://github.com/ngx-formly/ngx-formly/issues/733)) ([1db51bb](https://github.com/ngx-formly/ngx-formly/commit/1db51bb)), closes [#732](https://github.com/ngx-formly/ngx-formly/issues/732)



<a name="2.0.0-rc.27"></a>
# [2.0.0-rc.27](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.26...v2.0.0-rc.27) (2018-02-18)


### Features

* **core:** add `modelChange` output to emit the formly model changes. ([#726](https://github.com/ngx-formly/ngx-formly/issues/726)) ([9bf5102](https://github.com/ngx-formly/ngx-formly/commit/9bf5102)), closes [#720](https://github.com/ngx-formly/ngx-formly/issues/720)



<a name="2.0.0-rc.26"></a>
# [2.0.0-rc.26](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.25...v2.0.0-rc.26) (2018-02-17)


### Bug Fixes

* **core:** assign changed model in expressionProperties into formControl. ([#724](https://github.com/ngx-formly/ngx-formly/issues/724)) ([fc3f935](https://github.com/ngx-formly/ngx-formly/commit/fc3f935)), closes [#723](https://github.com/ngx-formly/ngx-formly/issues/723)


### Performance Improvements

* **core:** use JSON.stringify for comparing object in expressionProperties. ([#725](https://github.com/ngx-formly/ngx-formly/issues/725)) ([122a685](https://github.com/ngx-formly/ngx-formly/commit/122a685))



<a name="2.0.0-rc.25"></a>
# [2.0.0-rc.25](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.24...v2.0.0-rc.25) (2018-02-15)


### Features

* **core:** support using `className` in expressionProperties. ([#721](https://github.com/ngx-formly/ngx-formly/issues/721)) ([b96329e](https://github.com/ngx-formly/ngx-formly/commit/b96329e))



<a name="2.0.0-rc.24"></a>
# [2.0.0-rc.24](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.23...v2.0.0-rc.24) (2018-02-15)


### Bug Fixes

* **demo:** add Material+Icons stylesheet ([#717](https://github.com/ngx-formly/ngx-formly/issues/717)) ([06fde99](https://github.com/ngx-formly/ngx-formly/commit/06fde99)), closes [#716](https://github.com/ngx-formly/ngx-formly/issues/716)


### Features

* **material:** allow using matPrefix/matSuffix within form-field wrapper. ([#719](https://github.com/ngx-formly/ngx-formly/issues/719)) ([97f4557](https://github.com/ngx-formly/ngx-formly/commit/97f4557)), closes [#715](https://github.com/ngx-formly/ngx-formly/issues/715)
* **material:** simplify creation custom field type. ([#718](https://github.com/ngx-formly/ngx-formly/issues/718)) ([1f25587](https://github.com/ngx-formly/ngx-formly/commit/1f25587))



<a name="2.0.0-rc.23"></a>
# [2.0.0-rc.23](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.22...v2.0.0-rc.23) (2018-02-12)


### Bug Fixes

* **core:** ensure passing a valid model in checkField expression. ([#713](https://github.com/ngx-formly/ngx-formly/issues/713)) ([688b902](https://github.com/ngx-formly/ngx-formly/commit/688b902))


### Performance Improvements

* **core:** avoid check fields expression in child component. ([#712](https://github.com/ngx-formly/ngx-formly/issues/712)) ([75fd149](https://github.com/ngx-formly/ngx-formly/commit/75fd149))



<a name="2.0.0-rc.22"></a>
# [2.0.0-rc.22](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.21...v2.0.0-rc.22) (2018-02-12)


### Bug Fixes

* **core:** ensure passing a valid form for checkField when fieldGroup is set. ([#709](https://github.com/ngx-formly/ngx-formly/issues/709)) ([dc6cf0e](https://github.com/ngx-formly/ngx-formly/commit/dc6cf0e))



<a name="2.0.0-rc.21"></a>
# [2.0.0-rc.21](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.20...v2.0.0-rc.21) (2018-02-10)


### Bug Fixes

* **bootstrap:** fixed input width when using add-ons ([#706](https://github.com/ngx-formly/ngx-formly/issues/706)) ([0fc4390](https://github.com/ngx-formly/ngx-formly/commit/0fc4390)), closes [#699](https://github.com/ngx-formly/ngx-formly/issues/699)


### Performance Improvements

* avoid using expressionProperties for Cascaded Select example. ([#705](https://github.com/ngx-formly/ngx-formly/issues/705)) ([96ad6cd](https://github.com/ngx-formly/ngx-formly/commit/96ad6cd))



<a name="2.0.0-rc.20"></a>
# [2.0.0-rc.20](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.19...v2.0.0-rc.20) (2018-02-09)


### Bug Fixes

* **core:** check fields expression after build to avoid creation dup formcontrol. ([#700](https://github.com/ngx-formly/ngx-formly/issues/700)) ([ae925fd](https://github.com/ngx-formly/ngx-formly/commit/ae925fd))


### Performance Improvements

* **core:** avoid build field twice. ([#697](https://github.com/ngx-formly/ngx-formly/issues/697)) ([dacbe3e](https://github.com/ngx-formly/ngx-formly/commit/dacbe3e))



<a name="2.0.0-rc.19"></a>
# [2.0.0-rc.19](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.18...v2.0.0-rc.19) (2018-02-08)


### Features

* **core:** add FormlyFormExpression for eval field expressions. ([#696](https://github.com/ngx-formly/ngx-formly/issues/696)) ([c8591ab](https://github.com/ngx-formly/ngx-formly/commit/c8591ab))



<a name="2.0.0-rc.18"></a>
# [2.0.0-rc.18](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.17...v2.0.0-rc.18) (2018-02-07)



<a name="2.0.0-rc.17"></a>
# [2.0.0-rc.17](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.16...v2.0.0-rc.17) (2018-01-26)


### Bug Fixes

* **bootstrap:** add missing bs4 label class for radio and multicheckbox. ([#682](https://github.com/ngx-formly/ngx-formly/issues/682)) ([cc0b607](https://github.com/ngx-formly/ngx-formly/commit/cc0b607)), closes [#679](https://github.com/ngx-formly/ngx-formly/issues/679)


### Features

* **bootstrap:** support bootstrap 4.0.0 ([#680](https://github.com/ngx-formly/ngx-formly/issues/680)) ([064e030](https://github.com/ngx-formly/ngx-formly/commit/064e030)), closes [#679](https://github.com/ngx-formly/ngx-formly/issues/679)


<a name="2.0.0-rc.16"></a>
# [2.0.0-rc.16](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.15...v2.0.0-rc.16) (2018-01-25)


### Features

* **bootstrap, material:** allow disable indeterminate state for checkbox. ([#678](https://github.com/ngx-formly/ngx-formly/issues/678)) ([78b0775](https://github.com/ngx-formly/ngx-formly/commit/78b0775)), closes [#674](https://github.com/ngx-formly/ngx-formly/issues/674)



<a name="2.0.0-rc.15"></a>
# [2.0.0-rc.15](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.14...v2.0.0-rc.15) (2018-01-24)


### Bug Fixes

* **bootstrap,material:** ensure using the model value for indeterminate state check. ([#675](https://github.com/ngx-formly/ngx-formly/issues/675)) ([2b82345](https://github.com/ngx-formly/ngx-formly/commit/2b82345)), closes [#674](https://github.com/ngx-formly/ngx-formly/issues/674)



<a name="2.0.0-rc.14"></a>
# [2.0.0-rc.14](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.13...v2.0.0-rc.14) (2018-01-22)


### Bug Fixes

* **core:** ensure passing a string path for FormGroup. ([#666](https://github.com/ngx-formly/ngx-formly/issues/666)) ([f5f2378](https://github.com/ngx-formly/ngx-formly/commit/f5f2378)), closes [#665](https://github.com/ngx-formly/ngx-formly/issues/665)



<a name="2.0.0-rc.13"></a>
# [2.0.0-rc.13](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.12...v2.0.0-rc.13) (2018-01-16)


### Bug Fixes

* **bootstrap, material:** add default value for select options. ([#655](https://github.com/ngx-formly/ngx-formly/issues/655)) ([e9819ec](https://github.com/ngx-formly/ngx-formly/commit/e9819ec))
* **core:** take account of model changes in wrappers and types. ([#664](https://github.com/ngx-formly/ngx-formly/issues/664)) ([e17cead](https://github.com/ngx-formly/ngx-formly/commit/e17cead)), closes [#658](https://github.com/ngx-formly/ngx-formly/issues/658)
* **bootstrap:** add missing addons style. ([#657](https://github.com/ngx-formly/ngx-formly/issues/657)) ([25fdbf7](https://github.com/ngx-formly/ngx-formly/commit/25fdbf7)), closes [#656](https://github.com/ngx-formly/ngx-formly/issues/656)



<a name="2.0.0-rc.12"></a>
# [2.0.0-rc.12](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.11...v2.0.0-rc.12) (2018-01-14)


### Bug Fixes

* **material:** remove underline for radio and checkbox field. ([#652](https://github.com/ngx-formly/ngx-formly/issues/652)) ([a66d8b1](https://github.com/ngx-formly/ngx-formly/commit/a66d8b1)), closes [#616](https://github.com/ngx-formly/ngx-formly/issues/616)



<a name="2.0.0-rc.11"></a>
# [2.0.0-rc.11](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.10...v2.0.0-rc.11) (2018-01-13)


### Bug Fixes

* **core:** ensure key is set when toggle `hide`. ([#650](https://github.com/ngx-formly/ngx-formly/issues/650)) ([e69ea08](https://github.com/ngx-formly/ngx-formly/commit/e69ea08))
* **core:** wrap hideExpression for field in fieldGroup. ([#647](https://github.com/ngx-formly/ngx-formly/issues/647)) ([b949ced](https://github.com/ngx-formly/ngx-formly/commit/b949ced))
* **material:** ensure calls to change event. ([#651](https://github.com/ngx-formly/ngx-formly/issues/651)) ([a2d52a8](https://github.com/ngx-formly/ngx-formly/commit/a2d52a8)), closes [#390](https://github.com/ngx-formly/ngx-formly/issues/390)



<a name="2.0.0-rc.10"></a>
# [2.0.0-rc.10](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.9...v2.0.0-rc.10) (2018-01-11)


### Bug Fixes

* **core:** take account of hideExpression for fieldGroup with empty key ([#639](https://github.com/ngx-formly/ngx-formly/issues/639)) ([3261878](https://github.com/ngx-formly/ngx-formly/commit/3261878))



<a name="2.0.0-rc.9"></a>
# [2.0.0-rc.9](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.8...v2.0.0-rc.9) (2018-01-09)


### Bug Fixes

* **bootstrap:** add missing `control-label` class for label ([#637](https://github.com/ngx-formly/ngx-formly/issues/637)) ([c9c6c61](https://github.com/ngx-formly/ngx-formly/commit/c9c6c61)), closes [#633](https://github.com/ngx-formly/ngx-formly/issues/633)



<a name="2.0.0-rc.8"></a>
# [2.0.0-rc.8](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.7...v2.0.0-rc.8) (2018-01-05)


### Bug Fixes

* **core:** add default wrappers when type is set ([#630](https://github.com/ngx-formly/ngx-formly/issues/630)) ([2dd41ab](https://github.com/ngx-formly/ngx-formly/commit/2dd41ab))



<a name="2.0.0-rc.7"></a>
# [2.0.0-rc.7](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.6...v2.0.0-rc.7) (2018-01-05)


### Bug Fixes

* **core:** avoid calling deepMerge for readonly property. ([#626](https://github.com/ngx-formly/ngx-formly/issues/626)) ([6b7987f](https://github.com/ngx-formly/ngx-formly/commit/6b7987f))
* **material:** ensure calls to lifecycle hooks ([#628](https://github.com/ngx-formly/ngx-formly/issues/628)) ([09a7149](https://github.com/ngx-formly/ngx-formly/commit/09a7149))
* **material,bootstrap:** Add asterisk for checkbox. ([#624](https://github.com/ngx-formly/ngx-formly/issues/624)) ([f8ed354](https://github.com/ngx-formly/ngx-formly/commit/f8ed354)), closes [#623](https://github.com/ngx-formly/ngx-formly/issues/623)



<a name="2.0.0-rc.6"></a>
# [2.0.0-rc.6](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.5...v2.0.0-rc.6) (2017-12-31)


### Bug Fixes

* **material:** force setting formly id ([#622](https://github.com/ngx-formly/ngx-formly/issues/622)) ([a4fa0bf](https://github.com/ngx-formly/ngx-formly/commit/a4fa0bf))



<a name="2.0.0-rc.5"></a>
# [2.0.0-rc.5](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2017-12-28)


### Bug Fixes

* **validation:** assign defaultOptions before validation init. ([#618](https://github.com/ngx-formly/ngx-formly/issues/618)) ([843bff4](https://github.com/ngx-formly/ngx-formly/commit/843bff4))



<a name="2.0.0-rc.4"></a>
# [2.0.0-rc.4](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.3...v2.0.0-rc.4) (2017-12-26)


### Bug Fixes

* **bootstrap,material:** ensure ids is unique for radio and checkbox types. ([#608](https://github.com/ngx-formly/ngx-formly/issues/608)) ([d47d7d1](https://github.com/ngx-formly/ngx-formly/commit/d47d7d1)), closes [#607](https://github.com/ngx-formly/ngx-formly/issues/607)
* **select:** ensure selectOption is updated when using expression. ([#612](https://github.com/ngx-formly/ngx-formly/issues/612)) ([bb84077](https://github.com/ngx-formly/ngx-formly/commit/bb84077))


### Features

* **material:** Add an asterisk to field when required. ([#609](https://github.com/ngx-formly/ngx-formly/issues/609)) ([71202af](https://github.com/ngx-formly/ngx-formly/commit/71202af)), closes [#604](https://github.com/ngx-formly/ngx-formly/issues/604)



<a name="2.0.0-rc.3"></a>
# [2.0.0-rc.3](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.2...v2.0.0-rc.3) (2017-12-19)


### Bug Fixes

* **bootstrap:** ensure to set a string value when select is not multiple. ([#602](https://github.com/ngx-formly/ngx-formly/issues/602)) ([6c591f8](https://github.com/ngx-formly/ngx-formly/commit/6c591f8)), closes [#601](https://github.com/ngx-formly/ngx-formly/issues/601)



<a name="2.0.0-rc.2"></a>
# [2.0.0-rc.2](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2017-12-14)


### Bug Fixes

* **core:** assign correctly model value in field expression during build. ([#596](https://github.com/ngx-formly/ngx-formly/issues/596)) ([77d62ae](https://github.com/ngx-formly/ngx-formly/commit/77d62ae))
* **core:** ensure nested form group is created for nested key. ([#597](https://github.com/ngx-formly/ngx-formly/issues/597)) ([3213f98](https://github.com/ngx-formly/ngx-formly/commit/3213f98))
* **core:** mark form unsubmitted on reset form. ([#591](https://github.com/ngx-formly/ngx-formly/issues/591)) ([082de94](https://github.com/ngx-formly/ngx-formly/commit/082de94))


### Features

* **bootstrap,material:** add multi-select support ([#598](https://github.com/ngx-formly/ngx-formly/issues/598)) ([97d8956](https://github.com/ngx-formly/ngx-formly/commit/97d8956))



<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2017-12-08)


### Bug Fixes

* **core:** change form validity when expressionProperty change. ([#590](https://github.com/ngx-formly/ngx-formly/issues/590)) ([290761c](https://github.com/ngx-formly/ngx-formly/commit/290761c)), closes [#582](https://github.com/ngx-formly/ngx-formly/issues/582)



<a name="2.0.0-rc.0"></a>
# [2.0.0-rc.0](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.8...v2.0.0-rc.0) (2017-12-07)


### Bug Fixes

* **core:** remove usage of setTimeout. ([#586](https://github.com/ngx-formly/ngx-formly/issues/586)) ([c3de20c](https://github.com/ngx-formly/ngx-formly/commit/c3de20c))
* **core:** take account of model changes when using hideExpression. ([#581](https://github.com/ngx-formly/ngx-formly/issues/581)) ([672679e](https://github.com/ngx-formly/ngx-formly/commit/672679e)), closes [#580](https://github.com/ngx-formly/ngx-formly/issues/580)
* **hideExpression:** use getFieldModel only for simple field ([#588](https://github.com/ngx-formly/ngx-formly/issues/588)) ([9a5eeac](https://github.com/ngx-formly/ngx-formly/commit/9a5eeac))


### Features

* **demo:** add copy to clipboard to example-viewer. ([#585](https://github.com/ngx-formly/ngx-formly/issues/585)) ([a307a7c](https://github.com/ngx-formly/ngx-formly/commit/a307a7c))
* **demo:** add preview code + more examples. ([#583](https://github.com/ngx-formly/ngx-formly/issues/583)) ([6a86dd4](https://github.com/ngx-formly/ngx-formly/commit/6a86dd4))
* **material:** use stable version `5.0.0` ([#587](https://github.com/ngx-formly/ngx-formly/issues/587)) ([023386d](https://github.com/ngx-formly/ngx-formly/commit/023386d))



<a name="2.0.0-beta.8"></a>
# [2.0.0-beta.8](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2017-11-28)


### Bug Fixes

* **validation:** display errors on blur. ([#576](https://github.com/ngx-formly/ngx-formly/issues/576)) ([680f6a3](https://github.com/ngx-formly/ngx-formly/commit/680f6a3))



<a name="2.0.0-beta.7"></a>
# [2.0.0-beta.7](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2017-11-27)


### Bug Fixes

* **FormlyConfig:** allow using function in validation messages. ([#573](https://github.com/ngx-formly/ngx-formly/issues/573)) ([745478d](https://github.com/ngx-formly/ngx-formly/commit/745478d))


### Features

* **bootstrap:** support version 3 ([#574](https://github.com/ngx-formly/ngx-formly/issues/574)) ([a447bf8](https://github.com/ngx-formly/ngx-formly/commit/a447bf8))



<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2017-11-21)


### Features

* **material:** allow rc versions ([#570](https://github.com/ngx-formly/ngx-formly/issues/570)) ([f532054](https://github.com/ngx-formly/ngx-formly/commit/f532054))



<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2017-11-19)


### Features

* **#566:** Show errors on submit ([#567](https://github.com/ngx-formly/ngx-formly/issues/567)) ([75c8b0b](https://github.com/ngx-formly/ngx-formly/commit/75c8b0b))
* **demo:** simplify `repeat` field type. ([#568](https://github.com/ngx-formly/ngx-formly/issues/568)) ([b96215d](https://github.com/ngx-formly/ngx-formly/commit/b96215d))



<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2017-11-13)


### Bug Fixes

* **#420:** allow reset wrappers ([#557](https://github.com/ngx-formly/ngx-formly/issues/557)) ([c870baa](https://github.com/ngx-formly/ngx-formly/commit/c870baa))
* **demo:** ensure demo is build without error. ([#564](https://github.com/ngx-formly/ngx-formly/issues/564)) ([b21c0e2](https://github.com/ngx-formly/ngx-formly/commit/b21c0e2))


### Features

* **travis:** deploy to gh-pages ([#559](https://github.com/ngx-formly/ngx-formly/issues/559)) ([fcbfd2f](https://github.com/ngx-formly/ngx-formly/commit/fcbfd2f))



<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2017-11-07)


### Bug Fixes

* **#551:** ensure templateOptions is defined ([#553](https://github.com/ngx-formly/ngx-formly/issues/553)) ([48f4a36](https://github.com/ngx-formly/ngx-formly/commit/48f4a36))
* **#551:** fixed assign object to string for `assignModelValue` ([#552](https://github.com/ngx-formly/ngx-formly/issues/552)) ([7b37c56](https://github.com/ngx-formly/ngx-formly/commit/7b37c56))



<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2017-11-07)


### Bug Fixes

* **clone:** create clone of date instead of empty object. ([#549](https://github.com/ngx-formly/ngx-formly/issues/549)) ([0dea289](https://github.com/ngx-formly/ngx-formly/commit/0dea289))


### Features

* **field:** allow passing function for field expression. ([#548](https://github.com/ngx-formly/ngx-formly/issues/548)) ([5e630fe](https://github.com/ngx-formly/ngx-formly/commit/5e630fe))
* **material2:** update to 5.0.0-rc0 ([#550](https://github.com/ngx-formly/ngx-formly/issues/550)) ([10baf1e](https://github.com/ngx-formly/ngx-formly/commit/10baf1e))



<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/ngx-formly/ngx-formly/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2017-11-03)


### Bug Fixes

* **textarea:**  set default value for rows and cols ([#546](https://github.com/ngx-formly/ngx-formly/issues/546)) ([2a0f783](https://github.com/ngx-formly/ngx-formly/commit/2a0f783))


### Features

* **validation:** move FormlyValidationMessage into core module ([#547](https://github.com/ngx-formly/ngx-formly/issues/547)) ([da502f2](https://github.com/ngx-formly/ngx-formly/commit/da502f2))



<a name="2.0.0-beta.0"></a>
# [2.0.0-beta.0](https://github.com/ngx-formly/ngx-formly/compare/1.0.0-rc.14...2.0.0-beta.0) (2017-11-01)


### Bug Fixes

* replace deprecated OpaqueToken with InjectionToken ([#508](https://github.com/ngx-formly/ngx-formly/issues/508)) ([fbf1dc3](https://github.com/ngx-formly/ngx-formly/commit/fbf1dc3))
* **#514:** avoid suppress and/or force validation messages. ([#524](https://github.com/ngx-formly/ngx-formly/issues/524)) ([1ffe899](https://github.com/ngx-formly/ngx-formly/commit/1ffe899))
* **field:** use showError instead of valid. ([2ba78a3](https://github.com/ngx-formly/ngx-formly/commit/2ba78a3))


### Features

* **#536:** use standard-version for CHANGELOG generation ([#538](https://github.com/ngx-formly/ngx-formly/issues/538)) ([9061311](https://github.com/ngx-formly/ngx-formly/commit/9061311))
* **bootstrap:** support Bootstrap 4 Beta ([#529](https://github.com/ngx-formly/ngx-formly/issues/529)) ([2b70567](https://github.com/ngx-formly/ngx-formly/commit/2b70567))
* **core:** rename package to `@ngx-formly` + follow Angular Package Format. ([#497](https://github.com/ngx-formly/ngx-formly/issues/497)) ([2197a51](https://github.com/ngx-formly/ngx-formly/commit/2197a51))
* **demo:** use angular-cli for demo-example ([#542](https://github.com/ngx-formly/ngx-formly/issues/542)) ([b8d6483](https://github.com/ngx-formly/ngx-formly/commit/b8d6483))
* **field:** remove deprecated `valid` prop. ([#537](https://github.com/ngx-formly/ngx-formly/issues/537)) ([88a9652](https://github.com/ngx-formly/ngx-formly/commit/88a9652))
* **fieldChanges:** remove FormlyPubSub in favor of fieldChanges option. ([#525](https://github.com/ngx-formly/ngx-formly/issues/525)) ([e78916f](https://github.com/ngx-formly/ngx-formly/commit/e78916f))
* **label:** append with an asterisk when required ([#523](https://github.com/ngx-formly/ngx-formly/issues/523)) ([bad3ecb](https://github.com/ngx-formly/ngx-formly/commit/bad3ecb))
* **material:** initial work for ui-material ([#534](https://github.com/ngx-formly/ngx-formly/issues/534)) ([11b8f9b](https://github.com/ngx-formly/ngx-formly/commit/11b8f9b))
* remove deprecated options. ([#507](https://github.com/ngx-formly/ngx-formly/issues/507)) ([6c46667](https://github.com/ngx-formly/ngx-formly/commit/6c46667))
* replace deprecated `Renderer` by `Renderer2` ([#498](https://github.com/ngx-formly/ngx-formly/issues/498)) ([0754b26](https://github.com/ngx-formly/ngx-formly/commit/0754b26))
* use `ng-template` for dynamic components ([#499](https://github.com/ngx-formly/ngx-formly/issues/499)) ([9203f1e](https://github.com/ngx-formly/ngx-formly/commit/9203f1e))
* **npm:** add publish script ([#510](https://github.com/ngx-formly/ngx-formly/issues/510)) ([0788a51](https://github.com/ngx-formly/ngx-formly/commit/0788a51))
* **npm:** allow angular v5. ([#520](https://github.com/ngx-formly/ngx-formly/issues/520)) ([1c6fb06](https://github.com/ngx-formly/ngx-formly/commit/1c6fb06))
* **npm:** update packages. ([#522](https://github.com/ngx-formly/ngx-formly/issues/522)) ([ecf5e0f](https://github.com/ngx-formly/ngx-formly/commit/ecf5e0f))
* **validation-message:** move FormlyValidationMessages into FormlyConfig ([#526](https://github.com/ngx-formly/ngx-formly/issues/526)) ([9b2e39f](https://github.com/ngx-formly/ngx-formly/commit/9b2e39f))


### BREAKING CHANGES

* **field:** `Field::valid` is no longer available, use `showError` instead.
* **validation-message:** removed FormlyValidationMessages
* **fieldChanges:** removed FormlyPubSub.
