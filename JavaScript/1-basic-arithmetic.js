'use strict';

// Visitor pattern represents operation(s) to be performed on the elements of
// object structure. It allows to define new operations without
// changing the classes on which it operates.
// This allows to:
// * group related operations, and separate unrelated;
// * easily add new operations. Contrary to simple inheritance which would
//   require changing whole hierarchy (i.e. adding another inteface to implement
//   to the Base class);
// * peform operations on elements of differing interfaces dependent on the
//   class of the element;
// * introduce state to the hierarchy traversal without explicitly passing any
//   arguments (via Visitor's internal state);
//
// Among the downsides of the Visitor pattern are:
// * unnecessary complication of the hierarchy and class interaction if there
//   is only a few operations;
// * makes it hard to add new elements to hierarchies that existing Visitors
//   operate on (it requires changing every visitor of the hierarchy);
//
// Main components of the Visitor pattern are
// * abstract Visitor interface that defines 'visit' operation for each
//   element/class;
// * concrete Visitor interface implementers that define particular operations
//   to be performed. May contain local state that is preseved/used/modified
//   during 'visits';
// * Base Element that defines `accept(visitor)` operation to be implemented
//   in the subclasses by calling the relevant Visitor method and concrete
//   Element subclasses that implement the `accept(visitor)` method;
// * Element hierarchy that allows traversal one way or another
//   (i.e. iteration, enumeration, implements Composite pattern);
//
// This example presents an hierarchy of basic arithmetic operations and
// various Visitors to perform different actions on them. The traversal is
// handled by the visitors themselves which leads to code duplication in
// `visitA` methods that handle containers but allows for more complex
// traversal patterns that each visitor can define separately. Another, more
// common way is to handle the structure traversal by the Elements in the
// `accept()` method (see second example for this approach) or have a separate
// traversor function.


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
    visitor.visitPlus(this);
  }
}

class MulElement extends BaseElement {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    visitor.visitMul(this);
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
}

class PrintVisitor {
  #expr = '';

  visitPlus(plusElement) {
    this.#expr += '(';
    plusElement.left.accept(this);
    this.#expr += ' + ';
    plusElement.right.accept(this);
    this.#expr += ')';
  }

  visitMul(mulElement) {
    this.#expr += '(';
    mulElement.left.accept(this);
    this.#expr += ' * ';
    mulElement.right.accept(this);
    this.#expr += ')';
  }

  visitLiteral(literalElement) {
    this.#expr += String(literalElement.value);
  }

  get expression() {
    return this.#expr;
  }
}

class CalculateVisitor {
  #result = 0;

  // It is possible to implement this visitor in-place (without creating new
  // visitors to calculate sub expressions) though that would be a bit more
  // complex.

  visitPlus(plusElement) {
    const leftVisitor = new CalculateVisitor();
    plusElement.left.accept(leftVisitor);
    const rightVisitor = new CalculateVisitor();
    plusElement.right.accept(rightVisitor);
    this.#result = leftVisitor.result + rightVisitor.result;
  }

  visitMul(mulElement) {
    const leftVisitor = new CalculateVisitor();
    mulElement.left.accept(leftVisitor);
    const rightVisitor = new CalculateVisitor();
    mulElement.right.accept(rightVisitor);
    this.#result = leftVisitor.result * rightVisitor.result;
  }

  visitLiteral(literalElement) {
    this.#result = Number(literalElement.value);
  }

  get result() {
    return this.#result;
  }
}

const example1 = new PlusElement(
  new MulElement(
    new LiteralElement(3),
    new PlusElement(
      new LiteralElement(5),
      new LiteralElement(7)
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
