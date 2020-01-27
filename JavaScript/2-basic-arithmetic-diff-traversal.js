'use strict';

// This example presents an hierarchy of basic arithmetic operations and
// various Visitors to perform different actions on them the same way the first
// example does but moves the structure traversal to the Elements's `accept()`
// method.
// In this example another Element was added to denote parentheses -
// ParenElement. The lack of ParenElement in the previous example makes it very
// hard to take operation priority into account with this traversal strategy.


// Elements hierarchy.
//
class BaseElement {
  accept(visitor) {}
}

class PlusElement extends BaseElement {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    this.left.accept(visitor);
    visitor.visitPlus(this);
    this.right.accept(visitor);
  }
}

class MulElement extends BaseElement {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    this.left.accept(visitor);
    visitor.visitMul(this);
    this.right.accept(visitor);
  }
}

class ParenElement extends BaseElement {
  constructor(value) {
    super();
    this.value = value;
  }

  accept(visitor) {
    visitor.visitParen(this);
  }
}

class LiteralElement extends BaseElement {
  constructor(value) {
    super();
    this.value = value;
  }

  accept(visitor) {
    visitor.visitLiteral(this);
  }
}


// Visitors
class BaseVisitor {
  visitPlus(plusElement) {}
  visitMul(mulElement) {}
  visitLiteral(literalElement) {}
  visitParen(parenElement) {}
}

class PrintVisitor {
  #expr = '';

  // Note the lack of code duplication to handle these cases.
  visitPlus(plusElement) {
    this.#expr += ' + ';
  }

  visitMul(mulElement) {
    this.#expr += ' * ';
  }

  visitLiteral(literalElement) {
    this.#expr += String(literalElement.value);
  }

  visitParen(parenElement) {
    this.#expr += '(';
    parenElement.value.accept(this);
    this.#expr += ')';
  }

  get expression() {
    return this.#expr;
  }
}

class CalculateVisitor {
  #result = 0;
  #pendingOperation = null;

  // Note the lack of code duplication to handle these cases.
  visitPlus(plusElement) {
    this.#pendingOperation = '+';
  }

  visitMul(mulElement) {
    this.#pendingOperation = '*';
  }

  visitLiteral(literalElement) {
    const val = Number(literalElement.value);
    this.handleValue(val);
  }

  visitParen(parenElement) {
    const visitor = new CalculateVisitor();
    parenElement.value.accept(visitor);
    this.handleValue(visitor.result);
  }

  handleValue(value) {
    switch (this.#pendingOperation) {
      case '+':
        this.#result += value;
        break;
      case '*':
        this.#result *= value;
        break;
      default:
        this.#result = value;
    }
    this.#pendingOperation = null;
  }

  get result() {
    return this.#result;
  }
}

class Expression {
  #elements = [];

  add(element) {
    this.#elements.push(element);
  }
}

const example1 = new PlusElement(
  new MulElement(
    new LiteralElement(3),
    new ParenElement(
      new PlusElement(
        new LiteralElement(5),
        new LiteralElement(7)
      )
    )
  ),
  new PlusElement(
    new LiteralElement(2),
    new LiteralElement(4)
  )
);

const printGroup = (title, fn) => {
  console.group(title);
  fn();
  console.log();
  console.groupEnd();
}

printGroup('PrintVisitor example', () => {
  const printVisitor = new PrintVisitor();
  example1.accept(printVisitor);
  console.log(printVisitor.expression);
});

printGroup('CalculateVisitor example', () => {
  const calcVisitor = new CalculateVisitor();
  example1.accept(calcVisitor);
  console.log(calcVisitor.result);
});
