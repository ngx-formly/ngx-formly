/**
 * Legacy implementation
 */
export function evalStringExpressionLegacy(expression: string, argNames: string[]): any {
  try {
    return Function(...argNames, `return ${expression};`) as any;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpression(
  expression: string | ((...value: any[]) => any) | boolean,
  thisArg: any,
  argVal: any[],
): any {
  if (typeof expression === 'function') {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
