// Arrow-function syntax supports lexical 'this'.
macro => {
  rule infix { () | { $body ... } } => {
    (function() {
      $body ...
    }).bind(this)
  }

  rule infix { $param:ident | { $body ... } } => {
    ($param) => { $body ... }
  }

  rule infix { ($param:ident (,) ...) | { $body ... } } => {
    (function($param (,) ...) {
      $body ...
    }).bind(this)
  }

  rule infix { () | $expr:expr } => {
    (function() {
      return $expr;
    }).bind(this)
  }

  rule infix { $param:ident | $expr:expr } => {
    ($param) => $expr
  }

  rule infix { ($param:ident (,) ...) | $expr:expr } => {
    (function($param (,) ...) {
      return $expr;
    }).bind(this)
  }
}

export =>;
