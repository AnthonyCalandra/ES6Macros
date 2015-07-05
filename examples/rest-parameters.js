function sumList(...args) {
  var sum = 0;
  args.forEach(function(n) {
    sum += n;
  });
  return sum;
}

sumList(1, 2, 3); // 6
