import { validateFormlyJson } from './validate-formly-json';

describe('Formly JSON configuration validation', () => {
  const check = (fields: unknown) => validateFormlyJson(JSON.stringify(fields));
  const errors = (fields: unknown) => check(fields).diagnostics.filter((item) => item.severity === 'error');

  it.each(['', ' \n\t'])('leaves empty input neutral', (source) => {
    expect(validateFormlyJson(source)).toEqual({ empty: true, syntaxValid: false, diagnostics: [] });
  });

  it('accepts an empty fields array', () => {
    expect(validateFormlyJson('[]')).toEqual({ empty: false, syntaxValid: true, diagnostics: [] });
  });

  it.each([
    '[/* comment */{}]',
    '[{} // comment\n]',
    '[{},]',
    '[{"key":"name",}]',
    "[{'key':'name'}]",
    '[{key:"name"}]',
    '[undefined]',
    '[{"key":"unterminated}]',
    '[{"key":"\\x20"}]',
    '[{}] false',
  ])('rejects non-strict JSON: %s', (source) => {
    const result = validateFormlyJson(source);
    expect(result.syntaxValid).toBe(false);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    for (const diagnostic of result.diagnostics) {
      expect(diagnostic.severity).toBe('error');
      expect(diagnostic.path).toEqual([]);
      expect(diagnostic.offset).toBeGreaterThanOrEqual(0);
      expect(diagnostic.offset + diagnostic.length).toBeLessThanOrEqual(source.length);
    }
  });

  it('reports exact syntax ranges before checking structure', () => {
    const source = '[/* remove me */{"type":false}]';
    expect(validateFormlyJson(source).diagnostics).toEqual([
      {
        severity: 'error',
        message: expect.stringContaining('Comments are not allowed'),
        path: [],
        offset: 1,
        length: '/* remove me */'.length,
      },
    ]);
  });

  it.each([{}, null, 'input', 3])('requires the root to be an array', (root) => {
    expect(errors(root)[0]).toMatchObject({ path: [], message: expect.stringContaining('Wrap a single field') });
  });

  it.each([
    ['keyless fields and groups', [{}, { fieldGroup: [{}] }]],
    [
      'null, empty, numeric, and path keys',
      [{ key: null }, { key: '' }, { key: 0 }, { key: ['address', 0, 'street'] }],
    ],
    [
      'repeated model keys',
      [
        { key: 'same', type: 'custom-one' },
        { key: 'same', type: 'custom-two' },
      ],
    ],
    ['attribute removal', [{ props: { attributes: { max: null, 'aria-label': 'Name', tabindex: 2 } } }]],
    [
      'custom types, wrappers, and properties',
      [{ type: 'my-type', wrappers: ['my-wrapper'], metadata: { other: 1 }, props: { customSettings: true } }],
    ],
    [
      'custom select options and property mappings',
      [
        {
          type: 'select',
          props: {
            options: [{ name: 'One', id: 1, locked: true }, 'two', 3, null],
            labelProp: 'name',
            valueProp: 'id',
            disabledProp: 'locked',
          },
        },
      ],
    ],
    ['a boolean legacy hideExpression', [{ hideExpression: true }]],
    [
      'fieldArray and fieldGroup together',
      [{ fieldArray: { fieldGroup: [{ type: 'input' }] }, fieldGroup: [{ key: 0 }] }],
    ],
    ['nullable optional props', [{ props: { required: null, min: null, options: null, attributes: null } }]],
    [
      'JSON-compatible expressions and validators',
      [
        {
          expressions: { 'props.disabled': 'model.locked' },
          validators: {
            validation: ['email', { name: 'custom', options: { value: 1 } }],
            custom: { expression: 'control.value === model.value', message: 'Values must match' },
          },
          asyncValidators: { custom: 'registered' },
        },
      ],
    ],
    [
      'validation and model settings',
      [
        {
          validation: { show: false, showAllErrors: true, messages: { required: 'Required' } },
          modelOptions: { updateOn: 'blur', debounce: { default: 300 } },
          props: { step: 'any' },
        },
      ],
    ],
  ])('preserves %s', (_, fields) => {
    expect(errors(fields)).toEqual([]);
  });

  it('reports nested values with exact paths and UTF-16 source ranges', () => {
    const source = '[{"fieldGroup":[{"props":{"label":"😀","required":"yes"}}]}]';
    expect(validateFormlyJson(source).diagnostics).toEqual([
      {
        severity: 'error',
        message: 'Expected boolean or null; received string.',
        path: [0, 'fieldGroup', 0, 'props', 'required'],
        offset: source.indexOf('"yes"'),
        length: 5,
      },
    ]);
  });

  it.each([
    [[false], [0]],
    [[{ type: 1 }], [0, 'type']],
    [[{ key: [false] }], [0, 'key', 0]],
    [[{ props: [] }], [0, 'props']],
    [[{ props: { options: {} } }], [0, 'props', 'options']],
    [[{ props: { attributes: { title: {} } } }], [0, 'props', 'attributes', 'title']],
    [[{ fieldGroup: {} }], [0, 'fieldGroup']],
    [[{ fieldArray: [] }], [0, 'fieldArray']],
    [[{ fieldArray: { fieldGroup: [null] } }], [0, 'fieldArray', 'fieldGroup', 0]],
    [[{ wrappers: [false] }], [0, 'wrappers', 0]],
    [[{ expressions: { hide: true } }], [0, 'expressions', 'hide']],
    [[{ expressionProperties: { 'props.required': false } }], [0, 'expressionProperties', 'props.required']],
    [[{ validation: { messages: { required: 1 } } }], [0, 'validation', 'messages', 'required']],
    [[{ validators: { validation: 'email' } }], [0, 'validators', 'validation']],
    [[{ validators: { validation: [{}] } }], [0, 'validators', 'validation', 0]],
    [[{ asyncValidators: { custom: false } }], [0, 'asyncValidators', 'custom']],
    [[{ modelOptions: { updateOn: 'input' } }], [0, 'modelOptions', 'updateOn']],
    [[{ modelOptions: { debounce: { default: '300' } } }], [0, 'modelOptions', 'debounce', 'default']],
    [[{ props: { step: 'whatever' } }], [0, 'props', 'step']],
  ])('rejects an unsupported shared shape at %j', (fields, path) => {
    expect(errors(fields)).toEqual([expect.objectContaining({ path })]);
  });

  it('warns about supported aliases and names their replacements', () => {
    const fields = [
      {
        templateOptions: { minlength: 1, maxlength: 3 },
        hideExpression: false,
        expressionProperties: {},
        optionsTypes: [],
        validation: { messages: { minlength: 'Too short', maxlength: 'Too long' } },
      },
    ];
    const diagnostics = check(fields).diagnostics;
    expect(diagnostics).toHaveLength(8);
    expect(diagnostics.every((item) => item.severity === 'warning')).toBe(true);
    expect(diagnostics.map((item) => item.message)).toEqual(
      expect.arrayContaining([
        '"templateOptions" is deprecated. Use props instead.',
        '"hideExpression" is deprecated. Use expressions.hide instead.',
        '"expressionProperties" is deprecated. Use expressions instead.',
        '"optionsTypes" is deprecated. Use a field preset instead.',
        '"minlength" is deprecated. Use minLength instead.',
        '"maxlength" is deprecated. Use maxLength instead.',
      ]),
    );
  });

  it.each(['fieldgroup', 'fieldGruop', 'fieldGrop', 'fieldGrooup', 'fieldGroux'])(
    'suggests a unique correction for %s',
    (name) => {
      const source = JSON.stringify([{ [name]: [] }]);
      expect(validateFormlyJson(source).diagnostics).toEqual([
        {
          severity: 'warning',
          message: `Did you mean "fieldGroup"? "${name}" may be a custom property.`,
          path: [0, name],
          offset: 2,
          length: name.length + 2,
        },
      ]);
    },
  );

  it('handles casing, wrapper typos, and canonical length aliases', () => {
    const result = check([{ KEY: 'x', wrapprs: [], props: { minLenght: 2, MaxLength: 3, requird: true } }]);
    expect(result.diagnostics.map((item) => item.message)).toEqual([
      'Did you mean "key"? "KEY" may be a custom property.',
      'Did you mean "wrappers"? "wrapprs" may be a custom property.',
      'Did you mean "minLength"? "minLenght" may be a custom property.',
      'Did you mean "maxLength"? "MaxLength" may be a custom property.',
      'Did you mean "required"? "requird" may be a custom property.',
    ]);
  });

  it('leaves distant, short, and ambiguous custom names alone', () => {
    expect(
      check([
        {
          metadata: {},
          typ: 'custom',
          props: { cows: 1, col: 2, applicationSetting: true },
          __proto__: null,
          constructor: {},
        },
      ]).diagnostics,
    ).toEqual([]);
  });

  it('does not check spelling inside arbitrary data or custom validator names', () => {
    const data = { requird: true, fieldGruop: 3 };
    expect(
      check([
        {
          defaultValue: data,
          model: data,
          metadata: data,
          props: { options: [data], custom: data, attributes: { requird: 'true' } },
          validators: { requird: { expression: 'true' } },
          validation: { messages: { requird: 'Custom message' } },
        },
      ]).diagnostics,
    ).toEqual([]);
  });

  it('never executes expressions, validators, or templates', () => {
    const evaluate = vi.spyOn(globalThis, 'eval');
    const expression = 'throw new Error("This must never run")';
    expect(
      errors([
        {
          expressions: { hide: expression },
          hideExpression: expression,
          validators: { custom: { expression } },
          template: '<script>throw new Error("Never run")</script>',
        },
      ]),
    ).toEqual([]);
    expect(evaluate).not.toHaveBeenCalled();
    evaluate.mockRestore();
  });
});
