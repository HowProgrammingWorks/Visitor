'use strict';

// Elements to be visited

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  accept(visit) {
    const inStock = true;
    visit(inStock); // Just a stub
  }
}

const SUNDAY = 0;
const SATURDAY = 6;

class Service {
  constructor(name) {
    this.name = name;
  }

  accept(visit) {
    const day = new Date().getDay();
    const available = day > SUNDAY && day < SATURDAY;
    visit(available);
  }
}

// Visitors to be acceped

class Purchase {
  constructor(items, delivery) {
    this.items = [];
    items.forEach((item) => {
      item.accept((available) => {
        const status = `${available ? '' : 'not '}available`;
        console.log(`Product "${item.name}" is ${status}`);
        this.items.push(item);
      });
    });
    delivery.accept((available) => {
      const status = `${available ? '' : 'not '}available`;
      console.log(`Service "Delivery" is ${status}`);
      this.delivery = available ? delivery : null;
    });
  }
}

class Inspection {
  constructor(items) {
    this.items = [...items];
  }

  check() {
    this.items.forEach((item) => {
      item.accept((available) => {
        const status = `${available ? 'in' : 'out of'} stock`;
        console.log(`Product "${item.name}" is ${status}`);
      });
    });
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
