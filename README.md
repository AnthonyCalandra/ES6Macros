ES6Macros
=========
This is a colection of macros which implement the new syntactic changes in ES6 (Harmony) while allowing you to compile them down to ES5 code using sweet.js. This will allow you to get familiar with writing ES6 code before all (or most) browsers implement them.

Licensed under the MIT license.

Getting Started
===============
A short introduction can be found [here](http://sweetjs.org/doc/main/sweet.html#introduction). For using sweet.js in the browser, there is an API available for compiling sjs files [here](http://sweetjs.org/doc/main/sweet.html#how-do-i-run-sweet.js-in-the-browser).

Sweet.js will generate some pretty ugly identifiers so if this is a problem for the sjs-generated JavaScript, then compile with the --readable-names flag. Keep in mind this only supports ES5 code.

What's Available
===============
Currently the following ES6 syntax is implemented:
- Arrow functions
- Classes
- Object literals (Experimental -- does not fully work properly since sweet.js doesn't fire callback functions for manipulating delimiters including braces.)

Reference
=========
I am following the new ES6 features (here)[https://github.com/lukehoban/es6features] and (here)[http://tc39wiki.calculist.org/es6/].
