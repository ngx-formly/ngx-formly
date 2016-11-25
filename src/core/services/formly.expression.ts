function evalStringExpression(expression: string, thisArg: any, argNames: string[], argVal: any[]) {
  try {
    return Function.bind.apply(Function, [void 0].concat(argNames.concat(`return ${expression};`)))().apply(thisArg, argVal);
  } catch (error) {
    console.error(error);
  }
}

export function evalExpression(expression: string | Function | boolean, thisArg: any, argNames: string[], argVal: any[]): boolean {
  if (expression instanceof Function) {
    return expression.apply(thisArg, argVal);
  } else if (typeof expression === 'string') {
    return evalStringExpression(expression, thisArg, argNames, argVal);
  } else {
    return expression ? true : false;
  }
}

export function expressionValueSetter(expression: string, expressionValue: any, thisArg: any, argNames: string[], argVal: any[]) {
  try {
    return Function.bind
      .apply(Function, [void 0].concat(['expressionValue'].concat(argNames.concat(`${expression} = expressionValue;`))))()
      .apply(thisArg, [expressionValue].concat(argVal));
  } catch (error) {
    console.error(error);
  }
}
