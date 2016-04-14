#ifndef __BUSINESS_CLASS__
#define __BUSINESS_CLASS__

#include "corba_proxy.hh"

class BusinessClass {
public:
  BusinessClass(CorbaProxy &c) : _corba_proxy(c) {}
  unsigned int foo(unsigned int i) {
    _corba_proxy.corba_call_1(i);
    return i;
  }
  void bar() {
    _corba_proxy.corba_call_2();
    _corba_proxy.corba_call_2();
  }

private:
  CorbaProxy &_corba_proxy;
};

#endif // __BUSINESS_CLASS__
