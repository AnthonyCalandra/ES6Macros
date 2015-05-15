let function = macro {
  rule { ($param:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) { $body ... } } => {
    (function($param (,) ... $defaultParam (,) ...) {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
      $body ...
    })
  }

  rule { $name($param:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) { $body ... } } => {
    function $name($param (,) ... $defaultParam (,) ...) {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
      $body ...
    }
  }

  rule { ($param:ident (,) ...) { $body ... } } => {
    function($param (,) ...) { $body ... }
  }

  rule { $name($param:ident (,) ...) { $body ... } } => {
    function $name($param (,) ...) { $body ... }
  }
}

export function;
