let function = macro {
  rule { ( $param:ident (,) ... $($defparam:ident = $defval) (,) ...) { $body ... } } => {
    (function($param (,) ... $defparam (,) ...) {
      $($defparam = (typeof $defparam === "undefined") ? $defval : $defparam) (;) ...
      $body ...
    })
  }

  rule { $name( $param:ident (,) ... $($defparam:ident = $defval) (,) ...) { $body ... } } => {
    function $name($param (,) ... $defparam (,) ...) {
      $($defparam = (typeof $defparam === "undefined") ? $defval : $defparam) (;) ...
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
