/*
  Some limitations due to sweet.js and readtables shown here:
    - This macro isn't recursive, as you can see with __proto__.toString.
    - Only works by redefining var which means it only works when defining
      object literals with 'var'.
    - The macro for 'super' is different than with the classes macro -- conflict.
*/

var x = 123;
var ok = {
  __proto__: {
    toString: function() {
      return "wat";
    }
  },
  x,
  "y": 123,
  toString() {
    return super.toString();
  }
};
console.log(ok.toString()); // => "wat"
