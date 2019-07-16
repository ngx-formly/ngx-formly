import { evalExpression, evalStringExpression } from './utils';

describe('evalStringExpression', () => {
  it('should  the value correctly', () => {
    const warn = spyOn(console, 'warn');

    evalStringExpression('this.field.templateOptions.label', []);
    expect(warn).toHaveBeenCalledWith(`NgxFormly: using 'this.field' in expressionProperties is deprecated since v5.1, use 'field' instead.`);
  });
});

describe('evalExpression', () => {
  it('should evaluate the value correctly', () => {
    let expression = () => { return this.model.val; };
    this.model = {
      val: 2,
    };
    expect(evalExpression(expression, this, [this.model])).toBe(2);
  });
});
