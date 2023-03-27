// type ConstructorType = { new (...args: any[]): {} };

// function addMetadata(uuidGen: () => string) {
//   return function <T extends ConstructorType>(construct: T) {
//     return class extends construct {
//       uuid = uuidGen();
//       date = new Date().toISOString();
//       constructor(...args: any[]) {
//         super(...args);
//       }
//     };
//   };
// }

// const uuidGeneraton = () => Math.random().toString(16).slice(2);

// function methodDecorator(
//   target: any,
//   propertyKey: string,
//   descriptor: PropertyDescriptor
// ) {
//   console.log('-- target --');
//   console.log(target);
//   console.log('-- proertyKey --');
//   console.log(propertyKey);
//   console.log('-- descriptor --');
//   console.log(descriptor);
// }

// @addMetadata(uuidGeneraton)
// class Person {
//   constructor(public name: string, public age: number) {}

//   @methodDecorator
//   printDetails() {
//     console.log(`name:${this.name}, age:${this.age}`);
//   }
// }

// const geppetto = new Person('geppetto', 55);
// console.log(geppetto);
// geppetto.printDetails();

export {};
