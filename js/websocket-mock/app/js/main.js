(function () {
  function initialize() {
    $('#area').append('Initializing websocket connection...<br>');
    ws = new WebSocket('ws://' + location.hostname + ':8888/ws');
    ws.onopen = function () {
      $('#area').append('Connected<br>');
    };
    ws.onmessage = function (message) {
      console.log('onmessage: ', message);
      $('#area').append('received: ', message.data, '<br>');
    };
    ws.onclose = function (e) {
      console.log('closed with ', e);
      $('#area').append('closed with ', e.code, '<br>');
    };
  }

  initialize();
})();