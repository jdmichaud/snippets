var http = require('http');
var fs = require('fs');

const PORT = 8001;

// We need a function which handles requests and send response
function handleRequest(request, response) {
  console.log(request.method, request.url);
  response.setHeader('Access-Control-Allow-Origin', '*');
  if (request.method === 'GET' && request.url === '/states') {
    console.log('send states');
    // Send the substate tree in JSON to the client for dynamic loading with ui-router-extras
    response.end(JSON.stringify(
      [
        {
          type: 'lLoad',
          name: 'state2',
          templateUrl: '$server2$/state2.html',
        },
        {
          type: 'lLoad',
          name: 'state3',
          templateUrl: '$server2$/state3.html',
        },
        {
          type: 'lLoad',
          name: 'state3.substate1',
          views: {
            subview: {
              template: `
              <div>
                <pre>This is substate1 yo!</pre><br>
                <button ng-click="vm.$state.go('state3.substate2')">Go to substate2</button>
              </div>`,
              controllerAs: 'vm',
              controller: 'SubStateController',
            },
          },
        },
        {
          type: 'lLoad',
          name: 'state3.substate2',
          views: {
            subview: {
              template: `
              <div>
                <pre>This is substate2 yo!</pre><br>
                <button ng-click="vm.$state.go('state3.substate1')">Go to substate1</button>
              </div>`,
              controllerAs: 'vm',
              controller: 'SubStateController',
            },
          },
        },
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
