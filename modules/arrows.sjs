// Arrow-function syntax supports lexical 'this'.
macro => {
  rule infix { () | { $code ... } } => {
    (function() {
      $code ...
    }).bind(this)
  }

  rule infix { $x:ident | { $code ... } } => {
    ($x) => { $code ... }
  }

  rule infix { ($x:ident (,) ...) | { $code ... } } => {
    (function($x (,) ...) {
      $code ...
    }).bind(this)
  }

  rule infix { () | $expr:expr } => {
    (function() {
      return $expr;
    }).bind(this)
  }

  rule infix { $x:ident | $expr:expr } => {
    ($x) => $expr
  }
  
  rule infix { ($x:ident (,) ...) | $expr:expr } => {
    (function($x (,) ...) {
      return $expr;
    }).bind(this)
  }
}

export =>;
