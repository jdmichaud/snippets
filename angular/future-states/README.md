## Dynamic definition of ui-router state

This snippet demonstrate the use of the ui-router-extra to dynamically define
state and lazy load a directive that will then use a statically define service.

## How to

server1 holds the files for the 'main' web server. Launch that server using a
simple python HTTP server:

```
cd server1
python -m SimpleHTTPServer
```

Then starts the second server which is a node executable:

```
cd server2
node server2.js
```

Then open the url with port 8000 in your browser.
