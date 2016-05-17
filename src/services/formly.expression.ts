

export function evalExpression(expression: string, thisArg: any, argNames: string[], argVal: any[]) {
  return Function.bind.apply(Function, [void 0].concat(argNames.concat("return " + expression + ";")))().apply(thisArg, argVal);
}

export function expressionValueSetter(expression: string, expressionValue: any, thisArg: any, argNames: string[], argVal: any[]) {
  return Function.bind.apply(Function, [void 0].concat(["expressionValue"].concat(argNames.concat(expression + "= expressionValue;"))))().apply(thisArg, [expressionValue].concat(argVal));
}
