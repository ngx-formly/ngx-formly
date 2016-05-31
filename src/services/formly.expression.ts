

export function evalExpression(expression: string, thisArg: any, argNames: string[], argVal: any[]) {
  try {
    return Function.bind.apply(Function, [void 0].concat(argNames.concat("return " + expression + ";")))().apply(thisArg, argVal);
  } catch (error) {
    console.error(error);
  }
}

export function expressionValueSetter(expression: string, expressionValue: any, thisArg: any, argNames: string[], argVal: any[]) {
  try {
    return Function.bind.apply(Function, [void 0].concat(["expressionValue"].concat(argNames.concat(expression + "= expressionValue;"))))().apply(thisArg, [expressionValue].concat(argVal));
  } catch (error) {
    console.error(error);
  }
}
