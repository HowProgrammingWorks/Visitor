'use strict';

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
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

  isAvailableAt(date) {
    const day = date.getDay();
    return day > Service.SUNDAY && day < Service.SATURDAY;
  }
}

class Purchase {
  constructor(items, delivery) {
    this.items = [];
    this.delivery = null;
    for (const product of items) {
      const available = product.inStock();
      if (available) {
        console.log(`Product "${product.name}" is in stock`);
        this.items.push(product);
      } else {
        console.log(`Product "${product.name}" is out of stock`);
      }
    }
    const now = new Date();
    const available = delivery.isAvailableAt(now);
    if (available) {
      console.log(`Service "${delivery.name}" is available`);
      this.delivery = delivery;
    } else {
      console.log(`Service "${delivery.name}" is not available`);
    }
  }
}

class Inspection {
  constructor(items) {
    this.items = items;
  }

  check() {
    for (const product of this.items) {
      const available = product.inStock();
      if (available) {
        console.log(`Product "${product.name}" is in stock`);
      } else {
        console.log(`Product "${product.name}" is out of stock`);
      }
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
