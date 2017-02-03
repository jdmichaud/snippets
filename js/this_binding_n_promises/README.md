# This bindings, function expressions and Promises

As you can see in `ko.js`, `this` is `undefined` in the function expression
passed to catched. This is due to the fact that function expressions
(in non strict mode) redefine their context. `this` points the global
context (`window` on a browser for example).

In `ok.js`, the function passed to `then` is an 'arrow function',
[as defined in ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
Arrow functions do not redefine their context, thus this is the one defined
as the instanciation of the class.
