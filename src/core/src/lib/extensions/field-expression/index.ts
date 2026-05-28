import { ConfigOption } from '@ngx-formly/core';
import { FieldExpressionExtension } from './field-expression';
import { FieldExpressionExtension as FieldExpressionLegacyExtension } from '../field-expression-legacy/field-expression';

/**
 * When evaluating Formly Expressions, whether to parse the expression using
 * new CSP-safe implementation (true) or legacy implementation (false)
 *
 * Defaults to `true`.
 */
export function withFormlyFieldExpression(cspSafeExpressionEval = true): ConfigOption {
  return {
    extensions: [
      {
        name: 'field-expression',
        extension: cspSafeExpressionEval ? new FieldExpressionExtension() : new FieldExpressionLegacyExtension(),
        priority: -100,
      },
    ],
  };
}
