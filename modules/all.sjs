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

macro ismethod {
  // ES6 allows semicolon at the end of method definitions.
  rule { static $methodName($param:ident (,) ...) { $methodBody ... }; }
  rule { static $methodName($param:ident (,) ...) { $methodBody ... } }
  rule { $methodName($param:ident (,) ...) { $methodBody ... }; }
  rule { $methodName($param:ident (,) ...) { $methodBody ... } }
}

// All these ugly Object.getPrototypeOf(Object.getPrototypeOf(this)) calls
// are great for macros since they don't require defining object properties just
// for accessing the parent.
macro super {
  rule { ($arg (,) ...) } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor.apply(this, [$arg (,) ...])
  }
  rule { .$methodName($arg (,) ...) } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).$methodName.apply(this, [$arg (,) ...])
  }
  rule { .$prop } => {
    Object.getPrototypeOf(Object.getPrototypeOf(this)).$prop
  }
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
  rule { $className extends $extends { $method:ismethod ... } } => {
    methods $className, $extends, $method ...
  }
  rule { $className { $method:ismethod ... } } => {
    methods $className, $method ...
  }
}

// Iterate through the list of methods.
macro methods {
  rule { $className, $parentName, $method:ismethod ... } => {
    // This is required for omitted constructors.
    defaultconstructor $className, $parentName
    $className.prototype = Object.create($parentName.prototype);
    $(method $className, $parentName, $method) ...
  }
  rule { $className, $method:ismethod ... } => {
    // This is required for omitted constructors.
    defaultconstructor $className
    $(method $className, $method) ...
  }
}

macro method {
  case { _ $className, $parentName, $accessModifier $methodName($methodParam:ident (,) ...) { $methodBody ... } } => {
    return #{
      method $className, $accessModifier $methodName($methodParam (,) ...) { $methodBody ... }
    }
  }
  case { _ $className, $accessModifier $methodName($methodParam:ident (,) ...) { $methodBody ... } } => {
    var accessModifier = unwrapSyntax(#{$accessModifier});
    // Is it the constructor?
    if (accessModifier === "static") {
      return #{
        $className.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      }
    }
  }
  case { _ $className, $parentName, $methodName($methodParam:ident (,) ...) { $methodBody ... } } => {
    var methodName = unwrapSyntax(#{$methodName}),
        accessModifier = unwrapSyntax(#{$accessModifier});

    // Is it the constructor?
    if (methodName === "constructor") {
      return #{
        function $className($methodParam (,) ...) {
          $methodBody ...
        }
      }
    } else {
      return #{
        $className.prototype.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      }
    }
  }
  case { _ $className, $methodName($methodParam:ident (,) ...) { $methodBody ... } } => {
    var methodName = unwrapSyntax(#{$methodName});
    // Is it the constructor?
    if (methodName === "constructor") {
      return #{
        function $className($methodParam (,) ...) {
          $methodBody ...
        }
      }
    } else {
      return #{
        $className.prototype.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      }
    }
  }
}

export =>;
export class;
export super;
