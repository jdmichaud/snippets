var testApp = angular.module('testApp', []);

testApp.controller('TestCtrl', ['$scope', '$timeout', function($scope) {
  var vm = this;
  vm.scope = 'Ta da !';
  vm.okDisabled = false;
  vm.cancelDisabled = false;
  
  vm.close = function () {
    console.log("Close called from directive");
  };
  
  vm.dismiss = function () {
    console.log("Dismiss called from directive");
  };
}]);
  
testApp.directive('myDialog', function() {
  return {
    // 'E' - only matches element name
    restrict: 'E',
    // To access the scope outside 
    transclude: true,
    // Allow to set custom OK/Cancel function by attributes on-ok and on-cancel
    // will be attributes
    scope: {
      // &: Create a biding to a method
      onOk: '&onOk',
      onCancel: '&onCancel',
      // @: Just pass the value provided, interpret what's inside {{ }}
      title: '@',
      // Two-way data-bindings
      okDisabled: '=',
      cancelDisabled: '=',
    },
    templateUrl: 'dialog.html',
  };
});
