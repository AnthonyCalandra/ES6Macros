macro defparam {
  rule {
    $defaultParam:ident = $defaultVal
  }
}

// Pattern class for the various forms of function parameters.
macro is_param {
  rule {
    $param:defparam
  }

  rule {
    $param:ident
  }
}

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

  rule infix { ($defaultParam:ident = $defaultVal) | { $body ... } } => {
    (function() {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam);
      $body ...
    }).bind(this)
  }

  rule infix { ($param:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) | { $body ... } } => {
    (function($param (,) ... $defaultParam (,) ...) {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
      $body ...
    }).bind(this)
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

  rule infix { ($defaultParam:ident = $defaultVal) | $expr:expr } => {
    (function($defaultParam) {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam);
      return $expr;
    }).bind(this)
  }

  rule infix { $param:ident | $expr:expr } => {
    ($param) => $expr
  }

  rule infix { ($param:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) | $expr:expr } => {
    (function($param (,) ... $defaultParam (,) ...) {
      $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
      return $expr;
    }).bind(this)
  }

  rule infix { ($param:ident (,) ...) | $expr:expr } => {
    (function($param (,) ...) {
      return $expr;
    }).bind(this)
  }
}

macro is_method {
  // ES6 allows semicolon at the end of method definitions.
  rule {
    static $methodName($param:is_param (,) ...) {
        $methodBody ...
    };
  }

  rule {
    static $methodName($param:is_param (,) ...) {
        $methodBody ...
    }
  }

  rule {
    get $methodName($param:is_param (,) ...) {
        $methodBody ...
    };
  }

  rule {
    get $methodName($param:is_param (,) ...) {
        $methodBody ...
    }
  }

  rule {
    set $methodName($param:is_param (,) ...) {
        $methodBody ...
    };
  }

  rule {
    set $methodName($param:is_param (,) ...) {
        $methodBody ...
    }
  }

  rule {
    $methodName($param:is_param (,) ...) {
        $methodBody ...
    };
  }

  rule {
    $methodName($param:is_param (,) ...) {
        $methodBody ...
    }
  }
}

// All these ugly Object.getPrototypeOf(Object.getPrototypeOf(this)) calls
// are great for macros since they don't require defining object properties just
// for accessing the parent.
let super = macro {
  rule { ($arg (,) ...) } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor.apply(this, [$arg (,) ...])
  }

  rule { .$methodName($arg (,) ...) } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).$methodName.apply(this, [$arg (,) ...])
  }

  rule { .$prop } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).$prop
  }

  // Since `super` is a reserved keyword, if it doesn't match any of the previous rules,
  // output as-is.
  rule {} => { super }
}

macro defaultconstructor {
  rule { $className, $parentName } => {
    function $className() {
      super();
    }
  }

  rule { $className } => {
    function $className() {}
  }
}

macro class {
  rule { $className extends $extends { $method:is_method ... } } => {
    methods $className, $extends, $method ...
  }

  rule { $className { $method:is_method ... } } => {
    methods $className, $method ...
  }
}

// Iterate through the list of methods.
macro methods {
  rule { $className, $parentName, $method:is_method ... } => {
    // This is required for omitted constructors.
    defaultconstructor $className, $parentName
    $className.prototype = Object.create($parentName.prototype);
    $className.prototype.constructor = $className;
    $(method $className, $method) ...
  }

  rule { $className, $method:is_method ... } => {
    // This is required for omitted constructors.
    defaultconstructor $className
    $(method $className, $method) ...
  }
}

macro method {
  case { _ $className, $accessModifier $methodName($methodParam:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) { $methodBody ... } } => {
    var accessModifier = unwrapSyntax(#{$accessModifier});
    // Is it a static method?
    if (accessModifier === "static") {
      return #{
        $className.$methodName = function($methodParam (,) ... $defaultParam (,) ...) {
          $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
          $methodBody ...
        };
      };
    } else { // 'get' and 'set'
      return #{
        $className.prototype.$methodName = function($methodParam (,) ... $defaultParam (,) ...) {
          $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
          $methodBody ...
        };
      };
    }
  }

  case { _ $className, $methodName($methodParam:ident (,) ... $($defaultParam:ident = $defaultVal) (,) ...) { $methodBody ... } } => {
    var methodName = unwrapSyntax(#{$methodName});
    // Is it the constructor?
    if (methodName === "constructor") {
      return #{
        function $className($methodParam (,) ... $defaultParam (,) ...) {
          $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
          $methodBody ...
        }
      };
    } else {
      return #{
        $className.prototype.$methodName = function($methodParam (,) ... $defaultParam (,) ...) {
          $($defaultParam = (typeof $defaultParam === "undefined") ? $defaultVal : $defaultParam) (;) ...
          $methodBody ...
        };
      };
    }
  }
}

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
export class;
export super;
export =>;
