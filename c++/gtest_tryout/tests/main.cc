#include <iostream>
#include "gtest/gtest.h"
#include "business_class_test.hh"

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
