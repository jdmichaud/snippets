#ifndef __BUSINESS_CLASS_TEST__
#define __BUSINESS_CLASS_TEST__

#include "gtest/gtest.h"

#include "business_class.hh"
#include "corba_proxy_mock.hh"

class BusinessClassTest : public ::testing::Test {
protected:
  BusinessClassTest() {}
  virtual ~BusinessClassTest() {}

  // Setup is executed each time a test case is run
  virtual void SetUp() {}
  // TearDown is executed each time a test case is finished, whatever the result
  virtual void TearDown() {}

  // Members of BusinessClassTest are available in all test cases
  CorbaProxyMock corba_proxy_mock;
};

TEST_F(BusinessClassTest, FooTest) {
  BusinessClass business(corba_proxy_mock);

  EXPECT_CALL(corba_proxy_mock, corba_call_1(42)).Times(1);
  EXPECT_EQ(42, business.foo(42));
}

TEST_F(BusinessClassTest, BarTest) {
  BusinessClass business(corba_proxy_mock);

  EXPECT_CALL(corba_proxy_mock, corba_call_2()).Times(2);
  business.bar();
}

#endif // __BUSINESS_CLASS_TEST__
