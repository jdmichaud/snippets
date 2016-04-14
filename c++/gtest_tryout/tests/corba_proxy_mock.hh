#ifndef __CORBA_PROXY_MOCK__
#define __CORBA_PROXY_MOCK__

#include "gmock/gmock.h"  // Brings in Google Mock.
#include "corba_proxy.hh"

class CorbaProxyMock : public CorbaProxy {
public:

  MOCK_METHOD1(corba_call_1, void(unsigned int));
  MOCK_METHOD0(corba_call_2, void());
};

#endif //__CORBA_PROXY_MOCK__
