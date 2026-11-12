import type { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { Node, ParseError, parseTree, printParseErrorCode } from 'jsonc-parser';

export interface ConfigurationDiagnostic {
  severity: 'error' | 'warning';
  message: string;
  path: (string | number)[];
  offset: number;
  length: number;
}

export interface ConfigurationValidation {
  empty: boolean;
  syntaxValid: boolean;
  diagnostics: ConfigurationDiagnostic[];
}

type Path = ConfigurationDiagnostic['path'];
type Shape = Record<string, Node['type']>;

const FIELD_SHAPE = {
  type: 'string',
  id: 'string',
  name: 'string',
  template: 'string',
  hide: 'boolean',
  resetOnHide: 'boolean',
  shareFormControl: 'boolean',
  className: 'string',
  fieldGroupClassName: 'string',
  focus: 'boolean',
  hooks: 'object',
  parsers: 'array',
} satisfies Partial<Record<keyof FormlyFieldConfig, Node['type']>>;

const PROP_SHAPE = {
  type: 'string',
  label: 'string',
  allowHtml: 'boolean',
  placeholder: 'string',
  disabled: 'boolean',
  options: 'array',
  rows: 'number',
  cols: 'number',
  description: 'string',
  hidden: 'boolean',
  max: 'number',
  min: 'number',
  minLength: 'number',
  minlength: 'number',
  maxLength: 'number',
  maxlength: 'number',
  pattern: 'string',
  required: 'boolean',
  trackByIndex: 'boolean',
  tabindex: 'number',
  readonly: 'boolean',
  attributes: 'object',
} satisfies Partial<Record<keyof FormlyFieldProps, Node['type']>>;

const FIELD_NAMES: (keyof FormlyFieldConfig)[] = [
  ...(Object.keys(FIELD_SHAPE) as (keyof FormlyFieldConfig)[]),
  'key',
  'defaultValue',
  'props',
  'templateOptions',
  'validation',
  'validators',
  'asyncValidators',
  'hideExpression',
  'expressionProperties',
  'expressions',
  'fieldGroup',
  'fieldArray',
  'modelOptions',
  'get',
  'model',
  'parent',
  'options',
  'form',
  'formControl',
  'optionsTypes',
  'wrappers',
];
const PROP_NAMES = [
  ...Object.keys(PROP_SHAPE),
  'step',
  'focus',
  'blur',
  'keyup',
  'keydown',
  'click',
  'change',
  'keypress',
  'wheel',
];
const DEPRECATED: Record<string, string> = {
  templateOptions: 'props',
  hideExpression: 'expressions.hide',
  expressionProperties: 'expressions',
  optionsTypes: 'a field preset',
};
const PARSE_MESSAGES: Partial<Record<ReturnType<typeof printParseErrorCode>, string>> = {
  PropertyNameExpected: 'Expected a property name in double quotes. Remove any trailing comma.',
  ValueExpected: 'Expected a JSON value. Remove any trailing comma.',
  ColonExpected: 'Expected a colon after the property name.',
  CommaExpected: 'Expected a comma between values.',
  CloseBraceExpected: 'Expected a closing brace.',
  CloseBracketExpected: 'Expected a closing bracket.',
  EndOfFileExpected: 'Unexpected text after the JSON value.',
  InvalidCommentToken: 'Comments are not allowed in strict JSON. Remove the comment.',
  UnexpectedEndOfString: 'This string is missing its closing double quote.',
  InvalidSymbol: 'Unexpected text. Use JSON values and double-quoted property names.',
};

export function validateFormlyJson(source: string): ConfigurationValidation {
  const diagnostics: ConfigurationDiagnostic[] = [];
  if (!source.trim()) return { empty: true, syntaxValid: false, diagnostics };

  const errors: ParseError[] = [];
  let root: Node;
  try {
    root = parseTree(source, errors, { disallowComments: true, allowTrailingComma: false });
  } catch {
    return {
      empty: false,
      syntaxValid: false,
      diagnostics: [
        {
          severity: 'error',
          message: 'This JSON is nested too deeply to check. Simplify its nesting.',
          path: [],
          offset: 0,
          length: 1,
        },
      ],
    };
  }

  for (const error of errors) {
    const code = printParseErrorCode(error.error);
    diagnostics.push({
      severity: 'error',
      message: PARSE_MESSAGES[code] ?? `Invalid JSON: ${code.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}.`,
      path: [],
      offset: error.offset,
      length: error.length,
    });
  }
  if (errors.length || !root) return { empty: false, syntaxValid: false, diagnostics };

  if (root.type !== 'array') {
    report(root, [], 'Expected a fields array. Wrap a single field in [ ... ].');
  } else {
    // An explicit stack keeps deeply nested field groups off the JavaScript call stack.
    const fields = (root.children ?? []).map((node, index) => ({ node, path: [index] as Path }));
    while (fields.length) {
      const { node, path } = fields.pop();
      if (!expect(node, path, ['object'])) continue;
      spelling(node, path, FIELD_NAMES);
      shape(node, path, FIELD_SHAPE);
      properties(node, path, (name, value, valuePath, key) => {
        if (Object.hasOwn(DEPRECATED, name))
          report(key, valuePath, `"${name}" is deprecated. Use ${DEPRECATED[name]} instead.`, 'warning');
        switch (name) {
          case 'key':
            if (expect(value, valuePath, ['string', 'number', 'null', 'array']) && value.type === 'array') {
              items(value, valuePath, (item, itemPath) => expect(item, itemPath, ['string', 'number']));
            }
            break;
          case 'props':
          case 'templateOptions':
            if (!expect(value, valuePath, ['object'])) break;
            spelling(value, valuePath, PROP_NAMES);
            shape(value, valuePath, PROP_SHAPE, true);
            properties(value, valuePath, (prop, child, childPath, propKey) => {
              if (prop === 'minlength' || prop === 'maxlength') {
                report(
                  propKey,
                  childPath,
                  `"${prop}" is deprecated. Use ${prop === 'minlength' ? 'minLength' : 'maxLength'} instead.`,
                  'warning',
                );
              }
              if (prop === 'step' && child.value !== 'any') expect(child, childPath, ['number', 'null']);
              if (prop === 'attributes' && child.type === 'object') {
                properties(child, childPath, (_, attribute, attributePath) =>
                  expect(attribute, attributePath, ['string', 'number', 'null']),
                );
              }
            });
            break;
          case 'fieldGroup':
            if (expect(value, valuePath, ['array']))
              items(value, valuePath, (child, childPath) => fields.push({ node: child, path: childPath }));
            break;
          case 'fieldArray':
            fields.push({ node: value, path: valuePath });
            break;
          case 'wrappers':
          case 'optionsTypes':
            if (expect(value, valuePath, ['array']))
              items(value, valuePath, (child, childPath) => expect(child, childPath, ['string']));
            break;
          case 'hideExpression':
            expect(value, valuePath, ['string', 'boolean']);
            break;
          case 'expressions':
          case 'expressionProperties':
            if (expect(value, valuePath, ['object']))
              properties(value, valuePath, (_, child, childPath) => expect(child, childPath, ['string']));
            break;
          case 'validation':
            if (!expect(value, valuePath, ['object'])) break;
            shape(value, valuePath, { show: 'boolean', showAllErrors: 'boolean', messages: 'object' });
            properties(value, valuePath, (prop, child, childPath) => {
              if (prop === 'messages' && child.type === 'object')
                properties(child, childPath, (name, message, messagePath, messageKey) => {
                  expect(message, messagePath, ['string']);
                  if (name === 'minlength' || name === 'maxlength')
                    report(
                      messageKey,
                      messagePath,
                      `"${name}" is deprecated. Use ${name === 'minlength' ? 'minLength' : 'maxLength'} instead.`,
                      'warning',
                    );
                });
            });
            break;
          case 'validators':
          case 'asyncValidators':
            if (expect(value, valuePath, ['object'])) {
              properties(value, valuePath, (prop, child, childPath) => {
                if (prop === 'validation') {
                  if (expect(child, childPath, ['array'])) items(child, childPath, validator);
                } else validator(child, childPath);
              });
            }
            break;
          case 'modelOptions':
            if (!expect(value, valuePath, ['object'])) break;
            properties(value, valuePath, (prop, child, childPath) => {
              if (prop === 'debounce' && expect(child, childPath, ['object']))
                shape(child, childPath, { default: 'number' });
              if (prop === 'updateOn' && !['change', 'blur', 'submit'].includes(child.value))
                report(child, childPath, 'Expected "change", "blur", or "submit".');
            });
            break;
          case 'hooks':
          case 'parsers':
          case 'get':
            report(key, valuePath, `"${name}" requires application code and is not checked here.`, 'warning');
            break;
        }
      });
    }
  }
  diagnostics.sort((a, b) => a.offset - b.offset);
  return { empty: false, syntaxValid: true, diagnostics };

  function report(node: Node, path: Path, message: string, severity: ConfigurationDiagnostic['severity'] = 'error') {
    diagnostics.push({ severity, message, path, offset: node.offset, length: node.length });
  }

  function expect(node: Node, path: Path, types: Node['type'][]): boolean {
    if (types.includes(node.type)) return true;
    report(node, path, `Expected ${types.join(' or ')}; received ${node.type}.`);
    return false;
  }

  function shape(node: Node, path: Path, rules: Shape, nullable = false) {
    properties(node, path, (name, value, valuePath) => {
      if (Object.hasOwn(rules, name)) expect(value, valuePath, nullable ? [rules[name], 'null'] : [rules[name]]);
    });
  }

  function validator(node: Node, path: Path) {
    if (!expect(node, path, ['string', 'object']) || node.type === 'string') return;
    shape(node, path, { name: 'string', expression: 'string', message: 'string' });
    if (!node.children?.some((property) => ['name', 'expression'].includes(property.children[0].value))) {
      report(node, path, 'Expected a registered validator name or an object with "name" or "expression".');
    }
  }

  function spelling(node: Node, path: Path, known: string[]) {
    properties(node, path, (name, _, valuePath, key) => {
      if (known.includes(name)) return;
      // Prefer canonical casing over the deprecated lowercase length aliases.
      const suggestions = known.filter((candidate) => candidate !== 'minlength' && candidate !== 'maxlength');
      const sameCase = suggestions.filter((candidate) => candidate.toLowerCase() === name.toLowerCase());
      const candidates = sameCase.length
        ? sameCase
        : name.length >= 4
          ? suggestions.filter(
              (candidate) => candidate.length >= 4 && oneEditApart(name.toLowerCase(), candidate.toLowerCase()),
            )
          : [];
      if (candidates.length === 1)
        report(key, valuePath, `Did you mean "${candidates[0]}"? "${name}" may be a custom property.`, 'warning');
    });
  }
}

function properties(node: Node, path: Path, visit: (name: string, value: Node, path: Path, key: Node) => void) {
  for (const property of node.children ?? []) {
    const [key, value] = property.children;
    visit(key.value, value, [...path, key.value], key);
  }
}

function items(node: Node, path: Path, visit: (item: Node, path: Path) => void) {
  node.children?.forEach((item, index) => visit(item, [...path, index]));
}

function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (a.length !== b.length) {
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }
  return (
    a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2))
  );
}
