# Purpose

This is a test project for Google Test / Google Mock.
The purpose is to describe a very basic working example from which a project can be later bootstraped.

# To compile

To compile, type `make`.
To compile the test, go in the tests folder and type `make`

# To execute

To execute the test, do:
```
./business-test
```

The output will describe which tests are executed and which tests are failed.

# To produce an XML report

In the tests folder, do:
```
export GTEST_OUTPUT=xml:/tmp/report.xml; ./business-test
```

# Content

The project is composed of some client code made out of two classes:

1. `CorbaProxy`: which is an example of a class used to provide connectivity through
the Corba protocol. It could have been anything: a database proxy, another utility class.
The purpose here is to demonstrate the dependency injection pattern.

2. `BusinessClass`: the class we want to test. If has two APIs (foo and bar) and calls
two different methods on `CorbaProxy`.

The tests demonstrate the use of a mock for the CorbaProxy class and how we
instrument it to test `BusinessClass` behavior.


