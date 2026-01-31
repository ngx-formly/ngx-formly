import { evalExpression } from './utils';

describe('evalExpression', () => {
  it('should evaluate the value correctly', () => {
    const model = { val: 2 };
    const expression = () => model.val;
    expect(evalExpression(expression, {}, [model])).toBe(2);
  });
});
