// Empty arrow function returns undefined
var empty = () => {};
console.log(empty());
console.log(typeof () => {} === "function");
console.log(Object.getPrototypeOf(() => {}) === Function.prototype);

// Single parameter case needs no parentheses around parameter list
var identity = x => x;
console.log("identity(123) => " + identity(123));

// No need for parentheses even for lower-precedence expression body
var square = x => x * x;
console.log("square(5) => " + square(5));

// Parenthesize the body to return an object literal expression
var keyMaker = val => ({key: val});
console.log("keyMaker(\"val\") => " + keyMaker("val").key);

// Statement body needs braces, must use 'return' explicitly if not void
var odds = [0, 2, 4, 6, 8].map(v => v + 1);
console.log(odds);

// `=>` has only lexical `this`, no dynamic `this`
var obj = {
  method: function() {
    return () => this;
  }
};
console.log(obj.method()() === obj);

var fake = { steal: obj.method() };
console.log(fake.steal() === obj);

// But `function` still has dynamic `this` of course
var real = { borrow: obj.method };
console.log(real.borrow()() === real);
