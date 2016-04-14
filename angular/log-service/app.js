var testApp = angular.module('testApp', []);

function restService() {
  return {
    log: function (message, timestamp, file, line, column) {
      console.log('L2, ' + timestamp + ', ' + file + '(' + line + '), ' + message);
    }
  }
}

function logService(restService) {
  function log(message) {
    StackTrace.get().then(function (stackframes) {
      console.log(stackframes);
      // Send the message with the callee filename and location
      restService.log(message,
                      Date.now(),
                      stackframes[2].fileName,
                      stackframes[2].lineNumber,
                      stackframes[2].columnNumber);
    }).catch(function () {
      console.log("log error");
    });
  };
  return {
    log: log,
  }
}

testApp.factory('restService', restService);
testApp.factory('logService', ['restService', logService]);

function TestCtrl(logService) {
  logService.log('controller loading...');
}

testApp.controller('TestCtrl', ['logService', TestCtrl]);

