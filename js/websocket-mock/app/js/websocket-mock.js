module.exports = exports = function (request) {
  var connection = request.accept(null, request.origin);

  console.log('client connected: ', request.origin);

	var intervalID = setInterval(function () {
		connection.send(JSON.stringify({
			key: 'value',
		}));
	}, 1000);

	connection.on('message', function (message) {
    if (message.type === 'utf8') {
      var object = JSON.parse(message.utf8Data);

      console.log('received:', object);

      setTimeout(function () {
        connection.sendUTF(JSON.stringify(object));
      }, 2000);
    }
  });

  connection.on('close', function (connection) {
    console.log('connection closed');
		clearInterval(intervalId);
  });
};
