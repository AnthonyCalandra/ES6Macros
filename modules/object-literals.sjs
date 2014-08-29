let var = macro {
  rule { $v = { $objProp:isprop (,) ... } } => {
    var propsObj = {
      $(iterateprops $objProp) (,) ...
    };
    var $v = {};
    if (propsObj.__proto__ === undefined) {
      Object.defineProperties($v, propsObj);
    } else {
      $v = Object.create(propsObj.__proto__, propsObj);
    }
  }
  rule { $($name = $expr:expr) (,) ... } => {
    $(var $name = $expr) ...
  }
}

macro isprop {
  rule { $methodName($param:ident (,) ...) { $methodBody ... } }
  rule { $key $[:] $val }
  rule { $ident:ident }
}

macro iterateprops {
  rule { $methodName($param:ident (,) ...) { $methodBody ... } } => {
    $methodName: {
      value: function($param (,) ...) {
        $methodBody ...
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }
  rule { __proto__ $[:] $val } => {
    __proto__: $val
  }
  rule { $key $[:] $val } => {
    $key: {
      value: $val,
      writable: true,
      enumerable: true,
      configurable: true
    }
  }
  rule { $ident:ident } => {
    $ident: {
      value: $ident,
      writable: true,
      enumerable: true,
      configurable: true
    }
  }
}

// All these ugly Object.getPrototypeOf(Object.getPrototypeOf(this)) calls
// are great for macros since they don't require defining object properties just
// for accessing the parent.
macro super {
  rule { ($arg (,) ...) } => {
    Object.getPrototypeOf(this).constructor.apply(this, [$arg (,) ...])
  }
  rule { .$methodName($arg (,) ...) } => {
    Object.getPrototypeOf(this).$methodName.apply(this, [$arg (,) ...])
  }
  rule { .$prop } => {
    Object.getPrototypeOf(this).$prop
  }
}

export var;
export super;
