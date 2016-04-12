var testApp = angular.module("testApp", ["ngAnimate"]);

testApp.controller("TabCtrl", ["$scope", "$location",
  function ($scope, $location) {
    var vm = this;
    vm.tabs = [
      {
        title: "Acquisition",
        url: "acquisition.html",
        visible: true,
      },
      {
        title: "Review",
        url: "review.html",
        visible: true,
      },
      {
        title: "ECG",
        url: "ecg.html",
        visible: false,
      },
      {
        title: "AW",
        url: "http://" + $location.host() + ":8001/aw.html",
        visible: true,
      },
    ];
    vm.currentTab = vm.tabs[0];
    vm.loading = false;

    // This event handlers are used to hadnle include events to improve feedback
    // to the user.
    $scope.$on('$includeContentRequested', function() {
      $scope.$evalAsync(function () {
        vm.loading = true;
        // If the tab was in error, try again with the original URL
        if (vm.currentTab.originalUrl !== undefined) {
          vm.currentTab.url = vm.currentTab.originalUrl;
          vm.currentTab.originalUrl = undefined;
        }
      });
    });
    $scope.$on('$includeContentLoaded', function() {
      $scope.$evalAsync(function () {
        vm.loading = false;
      });
    });
    $scope.$on('$includeContentError', function() {
      $scope.$evalAsync(function () {
        vm.loading = false;
        // Save the original URL for later retry
        vm.currentTab.originalUrl = vm.currentTab.url;
        vm.currentTab.url = "error.html"
      });
    });
  }
]);

testApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
