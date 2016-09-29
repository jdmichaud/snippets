cmake_minimum_required(VERSION 3.0.2)

FIND_PACKAGE(CURL)
IF (NOT CURL_FOUND)
  MESSAGE(FATAL_ERROR "Could not find the CURL library and development files.")
ENDIF()

set(SOURCES libcurltest.c)

add_definitions(-std=c99)

set(EXE_NAME libcurltest)
add_executable(${EXE_NAME} ${SOURCES})
target_link_libraries(${EXE_NAME} curl)

