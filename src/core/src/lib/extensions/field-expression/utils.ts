// CSP-compliant expression parser for Formly expressions
// Supports: model.path, formState.path, field.path, comparisons, logical operators, and negation

type ExpressionContext = {
  model: any;
  formState: any;
  field: any;
};

// Tokenizer
enum TokenType {
  IDENTIFIER = 'IDENTIFIER',
  DOT = 'DOT',
  BRACKET_OPEN = 'BRACKET_OPEN',
  BRACKET_CLOSE = 'BRACKET_CLOSE',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  UNDEFINED = 'UNDEFINED',
  OPERATOR = 'OPERATOR',
  LOGICAL = 'LOGICAL',
  NOT = 'NOT',
  ARITHMETIC = 'ARITHMETIC',
  PAREN_OPEN = 'PAREN_OPEN',
  PAREN_CLOSE = 'PAREN_CLOSE',
  TERNARY_QUESTION = 'TERNARY_QUESTION',
  TERNARY_COLON = 'TERNARY_COLON',
  EOF = 'EOF',
}

interface Token {
  type: TokenType;
  value: any;
}

class Tokenizer {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      this.skipWhitespace();

      if (this.pos >= this.input.length) break;

      const char = this.input[this.pos];

      // String literals
      if (char === '"' || char === "'") {
        tokens.push(this.readString());
      }
      // Numbers
      else if (/\d/.test(char)) {
        tokens.push(this.readNumber());
      }
      // Identifiers and keywords
      else if (/[a-zA-Z_$]/.test(char)) {
        tokens.push(this.readIdentifier());
      }
      // Operators and symbols
      else if (char === '.') {
        tokens.push({ type: TokenType.DOT, value: '.' });
        this.pos++;
      } else if (char === '[') {
        tokens.push({ type: TokenType.BRACKET_OPEN, value: '[' });
        this.pos++;
      } else if (char === ']') {
        tokens.push({ type: TokenType.BRACKET_CLOSE, value: ']' });
        this.pos++;
      } else if (char === '(') {
        tokens.push({ type: TokenType.PAREN_OPEN, value: '(' });
        this.pos++;
      } else if (char === ')') {
        tokens.push({ type: TokenType.PAREN_CLOSE, value: ')' });
        this.pos++;
      } else if (char === '?') {
        tokens.push({ type: TokenType.TERNARY_QUESTION, value: '?' });
        this.pos++;
      } else if (char === ':') {
        tokens.push({ type: TokenType.TERNARY_COLON, value: ':' });
        this.pos++;
      } else if (char === '!') {
        if (this.peek() === '=') {
          if (this.input[this.pos + 2] === '=') {
            tokens.push({ type: TokenType.OPERATOR, value: '!==' });
            this.pos += 3;
          } else {
            tokens.push({ type: TokenType.OPERATOR, value: '!=' });
            this.pos += 2;
          }
        } else {
          tokens.push({ type: TokenType.NOT, value: '!' });
          this.pos++;
        }
      } else if (char === '=' || char === '<' || char === '>') {
        tokens.push(this.readOperator());
      } else if (char === '+' || char === '*' || char === '/' || char === '%') {
        tokens.push({ type: TokenType.ARITHMETIC, value: char });
        this.pos++;
      } else if (char === '-') {
        // Check if this is a negative number or subtraction
        // It's a negative number if preceded by an operator, opening paren, or at the start
        const lastToken = tokens[tokens.length - 1];
        const isNegativeNumber =
          tokens.length === 0 ||
          lastToken?.type === TokenType.OPERATOR ||
          lastToken?.type === TokenType.LOGICAL ||
          lastToken?.type === TokenType.ARITHMETIC ||
          lastToken?.type === TokenType.PAREN_OPEN ||
          lastToken?.type === TokenType.TERNARY_QUESTION ||
          lastToken?.type === TokenType.TERNARY_COLON;

        if (isNegativeNumber && this.peek() && /\d/.test(this.peek())) {
          tokens.push(this.readNumber());
        } else {
          tokens.push({ type: TokenType.ARITHMETIC, value: '-' });
          this.pos++;
        }
      } else if (char === '&' && this.peek() === '&') {
        tokens.push({ type: TokenType.LOGICAL, value: '&&' });
        this.pos += 2;
      } else if (char === '|' && this.peek() === '|') {
        tokens.push({ type: TokenType.LOGICAL, value: '||' });
        this.pos += 2;
      } else {
        throw new Error(`Unexpected character: ${char} at position ${this.pos}`);
      }
    }

    tokens.push({ type: TokenType.EOF, value: null });
    return tokens;
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  private peek(offset = 1): string {
    return this.input[this.pos + offset] || '';
  }

  private readString(): Token {
    const quote = this.input[this.pos];
    this.pos++;
    let value = '';

    while (this.pos < this.input.length && this.input[this.pos] !== quote) {
      if (this.input[this.pos] === '\\') {
        this.pos++;
        if (this.pos < this.input.length) {
          const escaped = this.input[this.pos];
          switch (escaped) {
            case 'n':
              value += '\n';
              break;
            case 't':
              value += '\t';
              break;
            case 'r':
              value += '\r';
              break;
            default:
              value += escaped;
          }
        }
      } else {
        value += this.input[this.pos];
      }
      this.pos++;
    }

    this.pos++; // skip closing quote
    return { type: TokenType.STRING, value };
  }

  private readNumber(): Token {
    let value = '';

    // Handle negatives
    if (this.input[this.pos] === '-') {
      value += '-';
      this.pos++;
    }

    let hasDecimal = false;
    while (this.pos < this.input.length && /[\d.]/.test(this.input[this.pos])) {
      if (this.input[this.pos] === '.') {
        if (hasDecimal) {
          throw new Error(`Invalid number format: multiple decimal points at position ${this.pos}`);
        }
        hasDecimal = true;
      }
      value += this.input[this.pos];
      this.pos++;
    }

    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error(`Invalid number format: ${value}`);
    }

    return { type: TokenType.NUMBER, value: parsed };
  }

  private readIdentifier(): Token {
    let value = '';

    while (this.pos < this.input.length && /[a-zA-Z0-9_$]/.test(this.input[this.pos])) {
      value += this.input[this.pos];
      this.pos++;
    }

    // Check for keywords
    if (value === 'true' || value === 'false') {
      return { type: TokenType.BOOLEAN, value: value === 'true' };
    }
    if (value === 'null') {
      return { type: TokenType.NULL, value: null };
    }
    if (value === 'undefined') {
      return { type: TokenType.UNDEFINED, value: undefined };
    }

    return { type: TokenType.IDENTIFIER, value };
  }

  private readOperator(): Token {
    let op = this.input[this.pos];
    this.pos++;

    if (this.pos < this.input.length) {
      const next = this.input[this.pos];
      if (
        (op === '=' && next === '=') ||
        (op === '!' && next === '=') ||
        (op === '<' && next === '=') ||
        (op === '>' && next === '=')
      ) {
        op += next;
        this.pos++;

        // Check for === or !==
        if (this.pos < this.input.length && this.input[this.pos] === '=') {
          op += '=';
          this.pos++;
        }
      }
    }

    return { type: TokenType.OPERATOR, value: op };
  }
}

// Parser and Evaluator
class ExpressionParser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): (context: ExpressionContext) => any {
    const expr = this.parseTernary();
    return (context: ExpressionContext) => expr(context);
  }

  private parseTernary(): (context: ExpressionContext) => any {
    const expr = this.parseLogicalOr();

    if (this.current().type === TokenType.TERNARY_QUESTION) {
      this.consume(TokenType.TERNARY_QUESTION);
      const trueExpr = this.parseLogicalOr();
      this.consume(TokenType.TERNARY_COLON);
      const falseExpr = this.parseTernary();

      return (context: ExpressionContext) => {
        return expr(context) ? trueExpr(context) : falseExpr(context);
      };
    }

    return expr;
  }

  private parseLogicalOr(): (context: ExpressionContext) => any {
    let left = this.parseLogicalAnd();

    while (this.current().type === TokenType.LOGICAL && this.current().value === '||') {
      this.consume(TokenType.LOGICAL);
      const right = this.parseLogicalAnd();
      const prevLeft = left;
      left = (context: ExpressionContext) => prevLeft(context) || right(context);
    }

    return left;
  }

  private parseLogicalAnd(): (context: ExpressionContext) => any {
    let left = this.parseComparison();

    while (this.current().type === TokenType.LOGICAL && this.current().value === '&&') {
      this.consume(TokenType.LOGICAL);
      const right = this.parseComparison();
      const prevLeft = left;
      left = (context: ExpressionContext) => prevLeft(context) && right(context);
    }

    return left;
  }

  private parseComparison(): (context: ExpressionContext) => any {
    const left = this.parseAdditive();

    if (this.current().type === TokenType.OPERATOR) {
      const op = this.consume(TokenType.OPERATOR).value;
      const right = this.parseAdditive();

      return (context: ExpressionContext) => {
        const leftVal = left(context);
        const rightVal = right(context);

        switch (op) {
          case '===':
            return leftVal === rightVal;
          case '!==':
            return leftVal !== rightVal;
          case '==':
            return leftVal == rightVal;
          case '!=':
            return leftVal != rightVal;
          case '<':
            return leftVal < rightVal;
          case '<=':
            return leftVal <= rightVal;
          case '>':
            return leftVal > rightVal;
          case '>=':
            return leftVal >= rightVal;
          default:
            throw new Error(`Unknown operator: ${op}`);
        }
      };
    }

    return left;
  }

  private parseAdditive(): (context: ExpressionContext) => any {
    let left = this.parseMultiplicative();

    while (
      this.current().type === TokenType.ARITHMETIC &&
      (this.current().value === '+' || this.current().value === '-')
    ) {
      const op = this.consume(TokenType.ARITHMETIC).value;
      const right = this.parseMultiplicative();
      const prevLeft = left;

      if (op === '+') {
        left = (context: ExpressionContext) => prevLeft(context) + right(context);
      } else {
        left = (context: ExpressionContext) => prevLeft(context) - right(context);
      }
    }

    return left;
  }

  private parseMultiplicative(): (context: ExpressionContext) => any {
    let left = this.parseUnary();

    while (
      this.current().type === TokenType.ARITHMETIC &&
      (this.current().value === '*' || this.current().value === '/' || this.current().value === '%')
    ) {
      const op = this.consume(TokenType.ARITHMETIC).value;
      const right = this.parseUnary();
      const prevLeft = left;

      if (op === '*') {
        left = (context: ExpressionContext) => prevLeft(context) * right(context);
      } else if (op === '/') {
        left = (context: ExpressionContext) => prevLeft(context) / right(context);
      } else {
        left = (context: ExpressionContext) => prevLeft(context) % right(context);
      }
    }

    return left;
  }

  private parseUnary(): (context: ExpressionContext) => any {
    if (this.current().type === TokenType.NOT) {
      this.consume(TokenType.NOT);
      const expr = this.parseUnary();
      return (context: ExpressionContext) => !expr(context);
    }

    return this.parsePrimary();
  }

  private parsePrimary(): (context: ExpressionContext) => any {
    const token = this.current();

    // Parentheses
    if (token.type === TokenType.PAREN_OPEN) {
      this.consume(TokenType.PAREN_OPEN);
      const expr = this.parseTernary();
      this.consume(TokenType.PAREN_CLOSE);
      return expr;
    }

    // Literals
    if (
      token.type === TokenType.STRING ||
      token.type === TokenType.NUMBER ||
      token.type === TokenType.BOOLEAN ||
      token.type === TokenType.NULL ||
      token.type === TokenType.UNDEFINED
    ) {
      const value = token.value;
      this.pos++;
      return () => value;
    }

    // Property access (model.field, formState.prop, etc)
    if (token.type === TokenType.IDENTIFIER) {
      return this.parsePropertyAccess();
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
  }

  private parsePropertyAccess(): (context: ExpressionContext) => any {
    const path: Array<string | ((context: ExpressionContext) => any)> = [];

    // Read first identifier
    path.push(this.consume(TokenType.IDENTIFIER).value);

    // Read rest of path (dots and brackets)
    while (this.current().type === TokenType.DOT || this.current().type === TokenType.BRACKET_OPEN) {
      if (this.current().type === TokenType.DOT) {
        this.consume(TokenType.DOT);
        path.push(this.consume(TokenType.IDENTIFIER).value);
      } else {
        this.consume(TokenType.BRACKET_OPEN);

        // bracket notation can contain expressions
        if (this.current().type === TokenType.STRING) {
          path.push(this.consume(TokenType.STRING).value);
        } else if (this.current().type === TokenType.NUMBER) {
          path.push(String(this.consume(TokenType.NUMBER).value));
        } else {
          // dynamic property access
          const expr = this.parseTernary();
          path.push(expr);
        }

        this.consume(TokenType.BRACKET_CLOSE);
      }
    }

    return (context: ExpressionContext) => {
      let value: any = context;

      for (const segment of path) {
        if (value === null || value === undefined) {
          return undefined;
        }

        if (typeof segment === 'function') {
          value = value[segment(context)];
        } else {
          value = value[segment];
        }
      }

      return value;
    };
  }

  private current(): Token {
    return this.tokens[this.pos];
  }

  private consume(expectedType: TokenType): Token {
    const token = this.current();

    if (token.type !== expectedType) {
      throw new Error(`Expected ${expectedType}, got ${token.type}`);
    }

    this.pos++;
    return token;
  }
}

export function parseExpression(expression: string, argNames: string[]): any {
  try {
    const tokenizer = new Tokenizer(expression);
    const tokens = tokenizer.tokenize();
    const parser = new ExpressionParser(tokens);
    const evaluator = parser.parse();

    // Return a function that maps the args to the context
    return (...args: any[]) => {
      const context: any = {};
      argNames.forEach((name, i) => {
        context[name] = args[i];
      });
      return evaluator(context);
    };
  } catch (error) {
    console.error('Expression parse error:', error);
    return undefined;
  }
}

/**
 * Uses CSP-safe implementation
 */
export function evalStringExpression(expression: string, argNames: string[]): any {
  return parseExpression(expression, argNames);
}

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
