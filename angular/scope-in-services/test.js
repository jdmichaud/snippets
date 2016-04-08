var testApp = angular.module("testApp", []);

testApp.factory("DataService", function () {
  scope = {
    value: 42,
  };
  return {
    getScope: function () { return scope; },
    setValue: function (v) { scope.value = v; },
  };
});

testApp.controller("DisplayCtrl", ["$scope", "DataService", function ($scope, dataService) {
  $scope.servicescope = dataService.getScope();
}]);

testApp.controller("ChangeCtrl", ["$scope", "DataService", function ($scope, dataService) {
  $scope.servicescope = dataService.getScope();
  $scope.setValue = dataService.setValue;
}]);

