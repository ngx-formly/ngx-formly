import { evalExpression } from './utils';

describe('evalExpression', () => {
  it('should evaluate the value correctly', function() {
    const expression = () => this.model.val;
    this.model = {
      val: 2,
    };
    expect(evalExpression(expression, this, [this.model])).toBe(2);
  });
});
