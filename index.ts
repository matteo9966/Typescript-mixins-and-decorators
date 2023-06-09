//this is the interface for a Function in ts
import './class-decorators.ts';

/* 
-class declaration
-properties
-accessors
-methods
-parameters

*/

function SelfDriving(target: Function) {
  target.prototype.selfDrivable = true;
}

//se voglio definire un costruttore

function createInstance<T>(t: new () => T) {
  return new t();
}

class Car {
  model: 'four wheels';
  constructor() {}
}

//posso passare un costruttore a una funzione e questa mi restituise un istanza
const car = createInstance<Car>(Car);

type constructorWithParameters<T> = new (...constructorArgs: any[]) => T;

function createInstance2<T>(t: constructorWithParameters<T>, ...args: any[]) {
  return new t(args);
}

function createInstance3<R, T extends { new (...constructorArgs: any[]): R }>(
  constructor: T,
  ...args: any[]
): R {
  return new constructor(args);
}

class Test3 {
  private x: number;

  constructor(x: number) {
    this.x = x;
  }
}

//another sintax

//these two are the same:

function createInstance3_5<T>(t: new () => T) {
  return new t();
}

function createInstance4<T>(
  t: { new (...constructorArgs: any[]): T },
  ...args: any[]
) {
  return new t(args);
}

function Compact<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log('-- decorator function invoked --');
  return class extends constructor {
    gears: number = 5;
    wheels: number = 3;
  };
}

// i can extend the constructor:

function extendClass<T extends { new (...args: any[]): {} }>(t: T) {
  return class extends t {
    date = new Date();
  };
}

//now every class decorated with extendClass has the date property
@extendClass
class Dogos {
  age = 5;
}

const dogo = new Dogos();
console.log(dogo);

//mixins:

function myLogFunction() {
  return (st: string) => {
    console.log(st);
  };
}

const logger = myLogFunction();

//a function that creates a class

function createLoggerClass() {
  return class MyLoggerClass {
    private completeLog: string = '';
    log(str: string) {
      console.log(str);
      this.completeLog += str + '\n';
    }
    dump() {
      console.log(this.completeLog);
    }
  };
}

const MyLogger = createLoggerClass();

const logerInstance = new MyLogger();

logerInstance.log('this is something');
logerInstance.log('this is something else');
logerInstance.dump();

//you define a generic constructor type as

type Constructor<T> = new (...args: any[]) => T;

//then you can define the mixin - it takes a class and it extends it with other functions

function MixinClassCreator<T extends Constructor<{}>>(Constructor: T) {
  return class MixinClass extends Constructor {
    logDate() {
      console.log(new Date());
    }
  };
}

// lets try something different a mixin class that

class Size {
  x: number;
  y: number;
}

class Circle {
  r: number;
}

//this is a mixin function

function Scalable<T extends Constructor<{ x: number; y: number }>>(Base: T) {
  return class Scalable extends Base {
    isShape = true;
    getArea() {
      console.log('getArea called');
      return this.x * this.y;
    }

    scale(amount: number) {
      this.x = this.x * amount;
      this.y = this.y * amount;
    }
  };
}

const ScalableOb = Scalable(Size);

const square = new ScalableOb();

square.x = 5;
square.y = 10;
console.log(square.getArea());
square.scale(2);
console.log(square.getArea());

// i now have a mixin function that i can use as a decorator

@Scalable
class Square {
  x: number = 0;
  y: number = 0;
}

const sqr = new Square();
sqr.x = 10;
sqr.y = 10;

console.log(sqr['getArea']());

function myLoggerClass() {
  return new (class Logger {
    private completeLog: string = '';
    log(str: string) {
      console.log(str);
      this.completeLog += `${str}\n`;
    }
    dumpLog() {
      return this.completeLog;
    }
  })();
}

const logs = myLoggerClass();

// extending a definition

type ConstructorType = { new (...args: any[]): {} };

function addMetadata(uuidGen: () => string) {
  return function <T extends ConstructorType>(construct: T) {
    return class extends construct {
      uuid = uuidGen();
      date = new Date().toISOString();
      constructor(...args: any[]) {
        super(...args);
      }
    };
  };
}

const uuidGeneraton = () => Math.random().toString(16).slice(2);

function methodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log('-- target --');
  console.log(target);
  console.log('-- proertyKey --');
  console.log(propertyKey);
  console.log('-- descriptor --');
  console.log(descriptor);
}

@addMetadata(uuidGeneraton)
class Person {
  constructor(public name: string, public age: number) {}

  @methodDecorator
  printDetails() {
    console.log(`name:${this.name}, age:${this.age}`);
  }
}

const geppetto = new Person('geppetto', 55);
console.log(geppetto);
geppetto.printDetails();

// MEthod decorators

function connectionCheck(database: Database) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value; //the oriaignal method
    descriptor.value = function (...args: any[]) {
      console.log('calling the wrapped method');
      console.log('connected:', database.connected);
      // if (!database.connected) {
      //   throw new Error('call database.connect()!');
      // }
      return originalMethod.apply(this, args);
    };
  };
}

class Database {
  connected = false;
  mockData = ['oranges', 'potatoes', 'chicken'];
  constructor() {}

  connect() {
    this.connected = true;
  }

  @connectionCheck(this) //doesnt work :( 
  getData() {
    return { error: false, data: this.mockData };
  }
}

const database = new Database();
database.connect();
database.getData();
