import { evalExpression, evalStringExpression } from './utils';

describe('evalExpression', () => {
  it('should evaluate the value correctly', () => {
    const model = { val: 2 };
    const expression = () => model.val;
    expect(evalExpression(expression, {}, [model])).toBe(2);
  });
});

describe('evalStringExpression', () => {
  describe('property access', () => {
    it('should access model properties', () => {
      const expr = evalStringExpression('model.name', ['model']);
      expect(expr({ name: 'Marisol' })).toBe('Marisol');
    });

    it('should access nested properties', () => {
      const expr = evalStringExpression('model.user.name', ['model']);
      expect(expr({ user: { name: 'Asif' } })).toBe('Asif');
    });

    it('should access formState properties', () => {
      const expr = evalStringExpression('formState.disabled', ['model', 'formState']);
      expect(expr({}, { disabled: true })).toBe(true);
    });

    it('should access field properties', () => {
      const expr = evalStringExpression('field.key', ['model', 'formState', 'field']);
      expect(expr({}, {}, { key: 'email' })).toBe('email');
    });

    it('should handle bracket notation with strings', () => {
      const expr = evalStringExpression('model["name"]', ['model']);
      expect(expr({ name: 'Test' })).toBe('Test');
    });

    it('should handle bracket notation with numbers', () => {
      const expr = evalStringExpression('model[0]', ['model']);
      expect(expr(['first', 'second'])).toBe('first');
    });

    it('should return undefined for null/undefined properties', () => {
      const expr = evalStringExpression('model.missing.nested', ['model']);
      expect(expr({ missing: null })).toBeUndefined();
    });
  });

  describe('comparison operators', () => {
    it('should evaluate === operator', () => {
      const expr = evalStringExpression('model.age === 25', ['model']);
      expect(expr({ age: 25 })).toBe(true);
      expect(expr({ age: 26 })).toBe(false);
    });

    it('should evaluate !== operator', () => {
      const expr = evalStringExpression('model.status !== "active"', ['model']);
      expect(expr({ status: 'inactive' })).toBe(true);
      expect(expr({ status: 'active' })).toBe(false);
    });

    it('should evaluate < operator', () => {
      const expr = evalStringExpression('model.count < 10', ['model']);
      expect(expr({ count: 5 })).toBe(true);
      expect(expr({ count: 15 })).toBe(false);
    });

    it('should evaluate <= operator', () => {
      const expr = evalStringExpression('model.count <= 10', ['model']);
      expect(expr({ count: 10 })).toBe(true);
      expect(expr({ count: 11 })).toBe(false);
    });

    it('should evaluate > operator', () => {
      const expr = evalStringExpression('model.count > 10', ['model']);
      expect(expr({ count: 15 })).toBe(true);
      expect(expr({ count: 5 })).toBe(false);
    });

    it('should evaluate >= operator', () => {
      const expr = evalStringExpression('model.count >= 10', ['model']);
      expect(expr({ count: 10 })).toBe(true);
      expect(expr({ count: 9 })).toBe(false);
    });
  });

  describe('logical operators', () => {
    it('should evaluate && operator', () => {
      const expr = evalStringExpression('model.a && model.b', ['model']);
      expect(expr({ a: true, b: true })).toBe(true);
      expect(expr({ a: true, b: false })).toBe(false);
      expect(expr({ a: false, b: true })).toBe(false);
    });

    it('should evaluate || operator', () => {
      const expr = evalStringExpression('model.a || model.b', ['model']);
      expect(expr({ a: false, b: false })).toBe(false);
      expect(expr({ a: true, b: false })).toBe(true);
      expect(expr({ a: false, b: true })).toBe(true);
    });

    it('should evaluate ! operator', () => {
      const expr = evalStringExpression('!model.disabled', ['model']);
      expect(expr({ disabled: false })).toBe(true);
      expect(expr({ disabled: true })).toBe(false);
    });

    it('should evaluate complex logical expressions', () => {
      const expr = evalStringExpression('model.a && model.b || model.c', ['model']);
      expect(expr({ a: true, b: true, c: false })).toBe(true);
      expect(expr({ a: false, b: true, c: true })).toBe(true);
      expect(expr({ a: false, b: false, c: false })).toBe(false);
    });
  });

  describe('arithmetic operators', () => {
    it('should evaluate addition', () => {
      const expr = evalStringExpression('model.a + model.b', ['model']);
      expect(expr({ a: 5, b: 3 })).toBe(8);
    });

    it('should evaluate subtraction', () => {
      const expr = evalStringExpression('model.a - model.b', ['model']);
      expect(expr({ a: 10, b: 4 })).toBe(6);
    });

    it('should evaluate multiplication', () => {
      const expr = evalStringExpression('model.a * model.b', ['model']);
      expect(expr({ a: 6, b: 7 })).toBe(42);
    });

    it('should evaluate division', () => {
      const expr = evalStringExpression('model.a / model.b', ['model']);
      expect(expr({ a: 20, b: 4 })).toBe(5);
    });

    it('should evaluate modulo', () => {
      const expr = evalStringExpression('model.a % model.b', ['model']);
      expect(expr({ a: 10, b: 3 })).toBe(1);
    });

    it('should handle negative numbers', () => {
      const expr = evalStringExpression('-5 + model.a', ['model']);
      expect(expr({ a: 10 })).toBe(5);
    });

    it('should handle negative number literals', () => {
      const expr = evalStringExpression('model.a + -3', ['model']);
      expect(expr({ a: 10 })).toBe(7);
    });

    it('should respect operator precedence (multiplication before addition)', () => {
      const expr = evalStringExpression('model.a + model.b * model.c', ['model']);
      expect(expr({ a: 2, b: 3, c: 4 })).toBe(14); // 2 + (3 * 4) = 14, not (2 + 3) * 4 = 20
    });

    it('should respect operator precedence (division before subtraction)', () => {
      const expr = evalStringExpression('model.a - model.b / model.c', ['model']);
      expect(expr({ a: 10, b: 8, c: 2 })).toBe(6); // 10 - (8 / 2) = 6, not (10 - 8) / 2 = 1
    });

    it('should handle parentheses to override precedence', () => {
      const expr = evalStringExpression('(model.a + model.b) * model.c', ['model']);
      expect(expr({ a: 2, b: 3, c: 4 })).toBe(20); // (2 + 3) * 4 = 20
    });

    it('should handle complex arithmetic expressions', () => {
      const expr = evalStringExpression('model.a * 2 + model.b / 2 - model.c', ['model']);
      expect(expr({ a: 5, b: 10, c: 3 })).toBe(12); // 5*2 + 10/2 - 3 = 10 + 5 - 3 = 12
    });
  });

  describe('ternary operator', () => {
    it('should evaluate ternary expressions', () => {
      const expr = evalStringExpression('model.age >= 18 ? "adult" : "minor"', ['model']);
      expect(expr({ age: 20 })).toBe('adult');
      expect(expr({ age: 15 })).toBe('minor');
    });

    it('should handle nested ternary expressions', () => {
      const expr = evalStringExpression('model.score >= 90 ? "A" : model.score >= 80 ? "B" : "C"', ['model']);
      expect(expr({ score: 95 })).toBe('A');
      expect(expr({ score: 85 })).toBe('B');
      expect(expr({ score: 75 })).toBe('C');
    });

    it('should evaluate ternary with arithmetic', () => {
      const expr = evalStringExpression('model.value > 0 ? model.value * 2 : model.value * -1', ['model']);
      expect(expr({ value: 5 })).toBe(10);
      expect(expr({ value: -5 })).toBe(5);
    });
  });

  describe('literals', () => {
    it('should handle string literals', () => {
      const expr = evalStringExpression('"hello"', ['model']);
      expect(expr({})).toBe('hello');
    });

    it('should handle number literals', () => {
      const expr = evalStringExpression('42', ['model']);
      expect(expr({})).toBe(42);
    });

    it('should handle decimal numbers', () => {
      const expr = evalStringExpression('3.14', ['model']);
      expect(expr({})).toBe(3.14);
    });

    it('should handle boolean literals', () => {
      const expr1 = evalStringExpression('true', ['model']);
      expect(expr1({})).toBe(true);

      const expr2 = evalStringExpression('false', ['model']);
      expect(expr2({})).toBe(false);
    });

    it('should handle null literal', () => {
      const expr = evalStringExpression('null', ['model']);
      expect(expr({})).toBe(null);
    });

    it('should handle undefined literal', () => {
      const expr = evalStringExpression('undefined', ['model']);
      expect(expr({})).toBeUndefined();
    });
  });

  describe('mixed expressions', () => {
    it('should handle comparison with arithmetic', () => {
      const expr = evalStringExpression('model.price * 1.1 > 100', ['model']);
      expect(expr({ price: 95 })).toBe(true); // 95 * 1.1 = 104.5 > 100
      expect(expr({ price: 85 })).toBe(false); // 85 * 1.1 = 93.5 < 100
    });

    it('should handle logical operators with comparisons and arithmetic', () => {
      const expr = evalStringExpression('model.age >= 18 && model.balance + model.deposit > 1000', ['model']);
      expect(expr({ age: 20, balance: 800, deposit: 300 })).toBe(true);
      expect(expr({ age: 16, balance: 800, deposit: 300 })).toBe(false);
      expect(expr({ age: 20, balance: 500, deposit: 300 })).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should return undefined for invalid expressions', () => {
      const expr = evalStringExpression('invalid expression @#$', ['model']);
      expect(expr).toBeUndefined();
    });

    it('should reject invalid number formats', () => {
      const expr = evalStringExpression('1.2.3', ['model']);
      expect(expr).toBeUndefined();
    });

    it('should handle expressions that result in runtime errors gracefully', () => {
      const expr = evalStringExpression('model.a / 0', ['model']);
      expect(expr({ a: 10 })).toBe(Infinity);
    });
  });

  describe('whitespace handling', () => {
    it('should handle expressions with various whitespace', () => {
      const expr = evalStringExpression('  model.a   +   model.b  ', ['model']);
      expect(expr({ a: 5, b: 3 })).toBe(8);
    });

    it('should handle expressions with no whitespace', () => {
      const expr = evalStringExpression('model.a+model.b', ['model']);
      expect(expr({ a: 5, b: 3 })).toBe(8);
    });
  });
});
