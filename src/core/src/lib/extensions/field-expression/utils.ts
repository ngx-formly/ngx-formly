export function evalStringExpression(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `return ${expression};`) as any;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpressionValueSetter(expression: string, argNames: string[]) {
  try {
    return Function(...argNames, `${expression} = expressionValue;`) as (value: any) => void;
  } catch (error) {
    console.error(error);
  }
}

export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
  if (typeof expression === 'function') {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
