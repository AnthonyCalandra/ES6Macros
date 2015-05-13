var obj = {
  x: 123,
  getX: function(z = this){
    return z.x;
  }
};
obj.getX(); // 123

function add(x = 0, y = 0) {
  return x + y;
}

add(); // 0
add(1); // 1
add(1, 1); // 2

var fn = function(x, y = { x: 2 }) {
  return y.x || x;
};
fn(1, {}); // 1
fn(1); // 2
fn(1, { x: 3 }); // 3
