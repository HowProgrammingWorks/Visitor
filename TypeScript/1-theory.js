class Product {
    name;
    price;
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    accept(visitor) {
        visitor.visitProduct(this);
    }
    inStock() {
        return true; // Just a stub
    }
}
class Service {
    name;
    static SUNDAY = 0;
    static SATURDAY = 6;
    constructor(name) {
        this.name = name;
    }
    accept(visitor) {
        visitor.visitService(this);
    }
    isAvailableAt(date) {
        const day = date.getDay();
        return day > Service.SUNDAY && day < Service.SATURDAY;
    }
}
class Purchase {
    items = [];
    delivery = null;
    constructor(items, delivery) {
        for (const item of items) {
            this.visitProduct(item);
        }
        this.visitService(delivery);
    }
    visitProduct(product) {
        const available = product.inStock();
        if (available) {
            console.log(`Product "${product.name}" is in stock`);
            this.items.push(product);
        }
        else {
            console.log(`Product "${product.name}" is out of stock`);
        }
    }
    visitService(service) {
        const now = new Date();
        const available = service.isAvailableAt(now);
        if (available) {
            console.log(`Service "${service.name}" is available`);
            this.delivery = service;
        }
        else {
            console.log(`Service "${service.name}" is not available`);
        }
    }
}
class Inspection {
    items;
    constructor(items) {
        this.items = items;
    }
    check() {
        for (const item of this.items) {
            this.visitProduct(item);
        }
    }
    visitProduct(product) {
        const available = product.inStock();
        if (available) {
            console.log(`Product "${product.name}" is in stock`);
        }
        else {
            console.log(`Product "${product.name}" is out of stock`);
        }
    }
    visitService(service) {
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
