class Shape {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    console.log("Shape moved.");
  }
}

class Rectangle extends Shape {
  move(x, y) {
    super.move(x, y);
    console.log(this.x);
  }
}

var rect = new Rectangle();
rect instanceof Rectangle;
rect instanceof Shape;
rect.move(1, 1);
