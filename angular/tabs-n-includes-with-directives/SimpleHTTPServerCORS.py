#! /usr/bin/env python2
from SimpleHTTPServer import SimpleHTTPRequestHandler
import BaseHTTPServer

class CORSRequestHandler (SimpleHTTPRequestHandler):
  def end_headers (self):
    self.send_header('Access-Control-Allow-Origin', '*')
    SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
  print "start CORS enabled web server"
  BaseHTTPServer.test(CORSRequestHandler, BaseHTTPServer.HTTPServer)

