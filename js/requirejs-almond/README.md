# RequireJS and almond

Almond is a library used to implement require/define global functions as in
RequireJS but for the browser. It is very lightweight and allow a clean way
to statically load you js module.

## Optimization

This example also demonstrate the use of the internal RequireJS optimizer
which use uglifyjs behind the scene. It will traverse the require/define
dependency tree, concatenate all the modules and uglify them.
