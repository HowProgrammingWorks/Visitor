interface Availability {
  accept(visitor: Visitor): void;
}

class Product implements Availability {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  accept(visitor: Visitor): void {
    visitor.visitProduct(this);
  }

  inStock() {
    return true; // Just a stub
  }
}

class Service implements Availability {
  name: string;

  private static SUNDAY = 0;
  private static SATURDAY = 6;

  constructor(name: string) {
    this.name = name;
  }

  accept(visitor: Visitor): void {
    visitor.visitService(this);
  }

  isAvailableAt(date: Date) {
    const day = date.getDay();
    return day > Service.SUNDAY && day < Service.SATURDAY;
  }
}

interface Visitor {
  visitProduct(product: Product): void;
  visitService(service: Service): void;
}

class Purchase implements Visitor {
  items = [];
  delivery = null;

  constructor(items: Array<Product>, delivery: Service) {
    for (const item of items) {
      this.visitProduct(item);
    }
    this.visitService(delivery);
  }

  visitProduct(product: Product): void {
    const available = product.inStock();
    if (available) {
      console.log(`Product "${product.name}" is in stock`);
      this.items.push(product);
    } else {
      console.log(`Product "${product.name}" is out of stock`);
    }
  }

  visitService(service: Service): void {
    const now = new Date();
    const available = service.isAvailableAt(now);
    if (available) {
      console.log(`Service "${service.name}" is available`);
      this.delivery = service;
    } else {
      console.log(`Service "${service.name}" is not available`);
    }
  }
}

class Inspection implements Visitor {
  items: Array<Product>;

  constructor(items: Array<Product>) {
    this.items = items;
  }

  check() {
    for (const item of this.items) {
      this.visitProduct(item);
    }
  }

  visitProduct(product: Product): void {
    const available = product.inStock();
    if (available) {
      console.log(`Product "${product.name}" is in stock`);
    } else {
      console.log(`Product "${product.name}" is out of stock`);
    }
  }

  visitService(service: Service): void {
    throw new Error('Not implemented');
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
