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
