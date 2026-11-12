import { FormlyFieldConfig, FormlyFieldConfigCache } from '../models';
import { FormArray, FormGroup } from '@angular/forms';
import { getKeyPath, isEqualValue } from '../utils';

export interface Schema {
  type?: string | string[];
  properties?: Record<string, Schema>;
  additionalProperties?: false;
  items?: Schema;
  anyOf?: Schema[];
  allOf?: Schema[];
  const?: unknown;
  title?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface AgentField {
  field: FormlyFieldConfig;
  path: string[];
  writable: boolean;
  password: boolean;
  schema?: Schema;
  value: (value: any) => any;
}

export function safeKey(key: string): boolean {
  return !['__proto__', 'prototype', 'constructor'].includes(key);
}

export function isJson(value: unknown, depth = 0): boolean {
  if (depth > 64) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((v) => isJson(v, depth + 1));
  return (
    !!value &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).every((key) => safeKey(key) && isJson((value as Record<string, unknown>)[key], depth + 1))
  );
}

export function objectSchema(): Schema {
  return { type: 'object', properties: Object.create(null), additionalProperties: false };
}

function inferSchema(value: any): Schema | undefined {
  if (!isJson(value)) return undefined;
  if (value === null) return { type: 'null' };
  if (Array.isArray(value)) {
    const items = value.map(inferSchema);
    return items.length ? { type: 'array', items: { anyOf: items } } : undefined;
  }
  if (typeof value === 'object') {
    const schema = objectSchema();
    for (const key of Object.keys(value)) {
      const child = inferSchema(value[key]);
      if (!child) return undefined;
      schema.properties[key] = child;
    }
    return schema;
  }
  return { type: typeof value };
}

function typeName(field: FormlyFieldConfig): string {
  return typeof field.type === 'string' ? field.type : '';
}

interface Choice {
  value: any;
  label?: string;
  disabled: boolean;
}

// Core cannot import the select entry point, which already depends on core.
function choices(options: any[], props: FormlyFieldConfig['props']): Choice[] {
  const result: Choice[] = [];
  const get = (option: any, prop: string) => {
    const mapping = props[`${prop}Prop`];
    return typeof mapping === 'function' ? mapping(option) : option?.[mapping || prop];
  };
  const visit = (option: any, mapped = false, disabled = false) => {
    if (!mapped && props.mapProp) {
      visit(props.mapProp(option), true, disabled);
      return;
    }
    const read = (prop: string) => (mapped ? option?.[prop] : get(option, prop));
    const group = read('group');
    disabled ||= !!read('disabled');
    if (Array.isArray(group)) {
      group.forEach((child) => visit(child, mapped, disabled));
    } else {
      const value = read('value');
      if (isJson(value)) result.push({ value, label: read('label'), disabled });
    }
  };
  options?.forEach((option) => visit(option));
  return result;
}

function describe(entry: AgentField, options: any[] | undefined) {
  const { field } = entry;
  const props = field.props || {};
  const type = typeName(field);
  if (props.type === 'file' || field.formControl instanceof FormGroup || field.formControl instanceof FormArray) return;

  let schema: Schema;
  if (props.options !== undefined) {
    if (!Array.isArray(options)) return;
    const all = choices(options, props);
    const enabled = all.filter((option) => !option.disabled);
    const optionSchema: Schema = {
      anyOf: enabled.map(({ value, label }) => ({
        const: value,
        ...(typeof label === 'string' ? { title: label } : {}),
      })),
    };
    const resolve = (value: any) => enabled.find((option) => isEqualValue(option.value, value))?.value;
    if (type === 'multicheckbox' && props.type !== 'array') {
      schema = objectSchema();
      enabled.forEach(({ value }) => {
        if (['string', 'number', 'boolean'].includes(typeof value) && safeKey(String(value))) {
          schema.properties[String(value)] = { type: 'boolean' };
        }
      });
      entry.value = (value) => ({ ...field.formControl.value, ...value });
    } else if (props.multiple || type === 'multicheckbox') {
      schema = { type: 'array', items: optionSchema };
      entry.value = (value: any[]) => {
        const locked = (Array.isArray(field.formControl.value) ? field.formControl.value : []).filter((selected: any) =>
          all.some((option) => option.disabled && isEqualValue(option.value, selected)),
        );
        return [...value.map(resolve), ...locked];
      };
    } else {
      schema = { anyOf: [...optionSchema.anyOf, { type: 'null' }] };
      entry.value = (value) => (value === null ? null : resolve(value));
    }
  } else {
    const inputType = props.type;
    let scalar: string;
    if (['number', 'integer'].includes(type) || ['number', 'range'].includes(inputType)) {
      scalar = type === 'integer' ? 'integer' : 'number';
    } else if (['checkbox', 'toggle', 'boolean'].includes(type) || inputType === 'checkbox') {
      scalar = 'boolean';
    } else if (
      ['input', 'textarea', 'string'].includes(type) ||
      ['text', 'email', 'password', 'url', 'tel'].includes(inputType)
    ) {
      scalar = 'string';
    }
    schema = scalar ? { type: [scalar, 'null'] } : inferSchema(field.formControl.value);
    if (!schema) return;
  }

  if (typeof props.label === 'string') schema.title = props.label;
  if (typeof (props.description || props.placeholder) === 'string')
    schema.description = props.description || props.placeholder;
  for (const [prop, keyword] of [
    ['min', 'minimum'],
    ['max', 'maximum'],
    ['minLength', 'minLength'],
    ['maxLength', 'maxLength'],
  ]) {
    if (typeof props[prop] === 'number') (schema as any)[keyword] = props[prop];
  }
  if (typeof props.pattern === 'string') schema.pattern = props.pattern;
  if (props.pattern instanceof RegExp && !props.pattern.flags) schema.pattern = props.pattern.source;
  entry.schema = schema;
}

export function collectFields(
  root: FormlyFieldConfig,
  defaultEnabled: boolean,
  options: (field: FormlyFieldConfig) => any[] | undefined,
): AgentField[] {
  const candidates = new Map<string, { entry: AgentField; included: boolean }[]>();
  const visit = (
    field: FormlyFieldConfigCache,
    parentPath: string[],
    enabled: boolean,
    hidden: boolean,
    readonly: boolean,
  ) => {
    if (!field) return;
    const path = [...parentPath, ...getKeyPath(field)];
    enabled = field.webMcp ?? enabled;
    hidden ||= !!(field.hide || field._hide || field.props?.hidden || field.props?.type === 'hidden');
    readonly ||= !!field.props?.readonly;
    if (field.fieldGroup || field.fieldArray) {
      field.fieldGroup?.forEach((child) => visit(child, path, enabled, hidden, readonly));
      return;
    }
    if (
      !path.length ||
      !path.every(safeKey) ||
      hidden ||
      !field.formControl ||
      root.form.get(path) !== field.formControl ||
      field._controlActive === false
    )
      return;

    const entry: AgentField = {
      field,
      path,
      writable: !readonly && !field.formControl.disabled,
      password: field.props?.type === 'password',
      value: (value) => value,
    };
    const key = JSON.stringify(path);
    if (!candidates.has(key)) candidates.set(key, []);
    candidates.get(key).push({ entry, included: enabled });
  };
  visit(root, [], defaultEnabled, false, false);

  const result: AgentField[] = [];
  candidates.forEach((aliases) => {
    // One model value must not escape an exclusion through a second visible editor.
    if (aliases.some(({ included }) => !included)) return;
    const entry = aliases[0].entry;
    entry.writable = aliases.every(({ entry }) => entry.writable);
    entry.password = aliases.some(({ entry }) => entry.password);
    aliases.forEach(({ entry }) => describe(entry, options(entry.field)));
    if (aliases.length > 1) {
      entry.schema = aliases.every(({ entry }) => entry.schema)
        ? { allOf: aliases.map(({ entry }) => entry.schema) }
        : undefined;
    }
    result.push(entry);
  });
  return result;
}

export function inputSchema(fields: AgentField[]): Schema {
  const root = objectSchema();
  for (const { path, schema, writable } of fields) {
    if (!schema || !writable) continue;
    let parent = root;
    for (const key of path.slice(0, -1)) {
      parent.properties[key] ??= objectSchema();
      parent = parent.properties[key];
      if (!parent.properties) break;
    }
    if (parent.properties) parent.properties[path[path.length - 1]] = schema;
  }
  return root;
}

export function matches(value: any, schema: Schema): boolean {
  if (schema.allOf) return schema.allOf.every((option) => matches(value, option));
  if (schema.anyOf) return schema.anyOf.some((option) => matches(value, option));
  if (Object.prototype.hasOwnProperty.call(schema, 'const')) return isEqualValue(schema.const, value);
  const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (!types.includes(actual) && !(types.includes('integer') && actual === 'number' && Number.isInteger(value)))
    return false;
  if (actual === 'array') return value.every((item: any) => matches(item, schema.items));
  if (actual === 'object')
    return Object.keys(value).every((key) => schema.properties?.[key] && matches(value[key], schema.properties[key]));
  return true;
}

export function parsePatch(args: unknown, fields: AgentField[]): { entry: AgentField; value: any }[] | undefined {
  if (!isJson(args) || !args || Array.isArray(args) || typeof args !== 'object') return undefined;
  const schema = inputSchema(fields);
  if (!matches(args, schema)) return undefined;
  const writes: { entry: AgentField; value: any }[] = [];
  for (const entry of fields) {
    let value: any = args;
    for (const key of entry.path) {
      if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
        value = undefined;
        break;
      }
      value = value[key];
    }
    if (value !== undefined) writes.push({ entry, value });
  }
  return writes;
}
