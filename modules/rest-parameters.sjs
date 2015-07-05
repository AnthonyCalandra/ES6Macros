let function = macro {
  rule { $name($param:ident (,) ... $(...$restParam:ident)) { $body ... } } => {
    function $name($param (,) ...) {
      var $restParam = Array.prototype.slice.call(arguments, this.$name.length);
      $body ...
    }
  }

  rule { ($param:ident (,) ... $(...$restParam:ident)) { $body ... } } => {
    function($param (,) ...) {
      var $restParam = Array.prototype.slice.call(arguments, arguments.callee.length);
      $body ...
    }
  }

  rule { $name($param:ident (,) ...) { $body ... } } => {
    function $name($param (,) ...) {
      $body ...
    }
  }

  rule { ($param:ident (,) ...) { $body ... } } => {
    function($param (,) ...) {
      $body ...
    }
  }
}

export function;
