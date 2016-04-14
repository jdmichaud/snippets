#include <iostream>

#include "corba_proxy.hh"
#include "business_class.hh"

int main(int argc, char **argv) {
  CorbaProxy proxy;
  BusinessClass business(proxy);

  business.foo(42);
  business.bar();

  return 0;
}
