macro is_method {
  // ES6 allows semicolon at the end of method definitions.
  rule {
    static $methodName($param:ident (,) ...) {
        $methodBody ...
    };
  }

  rule {
    static $methodName($param:ident (,) ...) {
        $methodBody ...
    }
  }

  rule {
    get $methodName($param:ident (,) ...) {
        $methodBody ...
    };
  }

  rule {
    get $methodName($param:ident (,) ...) {
        $methodBody ...
    }
  }

  rule {
    set $methodName($param:ident (,) ...) {
        $methodBody ...
    };
  }

  rule {
    set $methodName($param:ident (,) ...) {
        $methodBody ...
    }
  }

  rule {
    $methodName($param:ident (,) ...) {
        $methodBody ...
    };
  }

  rule {
    $methodName($param:ident (,) ...) {
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
  case { _ $className, $accessModifier $methodName($methodParam:ident (,) ...) { $methodBody ... } } => {
    var accessModifier = unwrapSyntax(#{$accessModifier});
    // Is it a static method?
    if (accessModifier === "static") {
      return #{
        $className.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      };
    } else { // 'get' and 'set'
      return #{
        $className.prototype.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      };
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
      };
    } else {
      return #{
        $className.prototype.$methodName = function($methodParam (,) ...) {
          $methodBody ...
        };
      };
    }
  }
}

export class;
export super;
