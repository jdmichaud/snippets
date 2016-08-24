var http = require('http');
var fs = require('fs');

const PORT = 8001;

// We need a function which handles requests and send response
function handleRequest(request, response) {
  console.log(request.method, request.url);
  response.setHeader('Access-Control-Allow-Origin', '*');
  if (request.method === 'GET' && request.url === '/states') {
    console.log('send states');
    response.end(JSON.stringify(
      [
        { type: 'lLoad', stateName: 'state2', url: '/state2', template: 'http://3.249.251.52:8001/state2.html' },
        { type: 'lLoad', stateName: 'state3', url: '/state3', template: 'http://3.249.251.52:8001/state3.html' }
      ]
    ));
  } else if (request.method === 'GET') {
    fs.readFile(request.url.slice(1), function (err, data) {
      console.log('send ' + request.url.slice(1));
      if (err) throw err;
      response.end(data);
    });
  }
}

// Create a server
var server = http.createServer(handleRequest);

// Lets start our server
server.listen(PORT, function () {
  // Callback triggered when server is successfully listening. Hurray!
  console.log('Server listening on: http://localhost:%s', PORT);
});
