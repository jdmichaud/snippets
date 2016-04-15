# Tabs and NgInclude

This example demonstrate how to use ngInclude to implement pages in tabs. One
of the page is loading an external resource.

## Run this example

First run a simple HTTP server:
```
python -m SimpleHTTPServer
```

This will start a webserver on the port 8000 to serve you application. Then to
demonstrate the use of external resource, in another terminal, start the CORS
enabled web server:
```
python -m SimpleHTTPServerCORS 8001
```
Then load ``http://localhost:8000` in your browser.`

## Angular and external resources

Angular prevent the use of external resources (resources loaded from a
different domaine than the original domain of the page) through ngInclude
directive.

To enable this, the example use a filter to entrust a particular URL. For
reference, see this [stackoverflow answer](http://stackoverflow.com/a/24519069/2603925).

## Circumventing Cross Origin Request protection (CORS)

In addition to the aforementioned technic, to hedge against security issues,
browser prevent a page to load a resources from a different domain than the
original domain ([ref](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)).
To allow CORS request, the server serving the external resources (the "external"
server) shall include, in its response HEADER, a additional field like so:
```
Access-Control-Allow-Origin: http://foo.example
```
This allows the domein http://foo.example to requests resource on this external
server. To allow for everybody, just use the kleene star:
```
Access-Control-Allow-Origin: *
```


