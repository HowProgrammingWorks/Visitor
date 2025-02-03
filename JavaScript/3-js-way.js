'use strict';

// Elements to be visited

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  accept(visitor) {
    visitor.visit(this, this.inStock());
  }

  inStock() {
    return true; // Just a stub
  }
}

class Service {
  static SUNDAY = 0;
  static SATURDAY = 6;

  constructor(name) {
    this.name = name;
  }

  accept(visitor) {
    const now = new Date();
    visitor.visit(this, this.isAvailableAt(now));
  }

  isAvailableAt(date) {
    const day = date.getDay();
    return day > Service.SUNDAY && day < Service.SATURDAY;
  }
}

// Visitors to be acceped

class Purchase {
  constructor(items, delivery) {
    this.items = [];
    this.delivery = null;
    for (const item of items) {
      item.accept(this);
    }
    delivery.accept(this);
  }

  visit(item, available) {
    const proto = Object.getPrototypeOf(item);
    const className = proto.constructor.name;
    if (available) {
      console.log(`${className} "${item.name}" is available`);
      if (item instanceof Service) this.delivery = item;
      else this.items.push(item);
    } else {
      console.log(`${className} "${item.name}" is not available`);
    }
  }
}

class Inspection {
  constructor(items) {
    this.items = items;
  }

  check() {
    for (const item of this.items) {
      item.accept(this);
    }
  }

  visit(item, available) {
    const proto = Object.getPrototypeOf(item);
    const className = proto.constructor.name;
    if (available) {
      console.log(`${className} "${item.name}" is in stock`);
    } else {
      console.log(`${className} "${item.name}" is out of stock`);
    }
  }
}

// Usage

const p1 = new Product('Laptop', 1500);
const p2 = new Product('Keyboard', 100);
const delivery = new Service('Delivery');
const electronics = new Purchase([p1, p2], delivery);
console.dir({ electronics });

const inspection = new Inspection([p1, p2]);
inspection.check();
