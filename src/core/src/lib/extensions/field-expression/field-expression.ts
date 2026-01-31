import { FieldExpressionExtension as FieldExpressionLegacyExtension } from '../field-expression-legacy/field-expression';
import { parseExpression } from './utils';

export class FieldExpressionExtension extends FieldExpressionLegacyExtension {
  protected override _evalStringExpression(expression: string, argNames: string[]) {
    return parseExpression(expression, argNames);
  }
}
