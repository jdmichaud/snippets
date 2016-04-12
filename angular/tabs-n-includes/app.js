var testApp = angular.module("testApp", ["ngAnimate"]);

testApp.controller("TabCtrl", ["$scope", "$location", "$timeout",
  function ($scope, $location, $timeout) {
    var vm = this;
    vm.tabs = [
      {
        title: "Acquisition",
        url: "acquisition.html",
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: true,
      },
      {
        title: "Review",
        url: "review.html",
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: true,
      },
      {
        title: "ECG",
        url: "ecg.html",
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: false,
      },
      {
        title: "AW",
        url: "http://" + $location.host() + ":8001/aw.html",
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: true,
      },
    ];
    vm.currentTab = vm.tabs[0];
    vm.loading = false;
    // Should be in a configuration service
    vm.maxUnsuccessfulLoad = 5;
    vm.retryDelay = 3000;

    // This event handlers are used to hande nginclude events to improve the
    // visual feedback to the user.
    $scope.$on('$includeContentRequested', function() {
      $scope.$evalAsync(function () {
        vm.loading = true;
      });
      // If the tab is in error, try to reload a finite number of time
      if (vm.currentTab.originalUrl !== undefined) {
        if (vm.currentTab.unsuccessfulLoad < vm.maxUnsuccessfulLoad) {
          // Try to reload the page every second until success
          console.log("will retry in ", vm.retryDelay / 1000, "s");
          vm.retryPromise = $timeout(function () {
            vm.currentTab.url = vm.currentTab.originalUrl;
            vm.currentTab.originalUrl = undefined;
          }, vm.retryDelay);
        } else {
          console.log("Tab", vm.currentTab.title ,
                      " is definitely down; hide the tab.");
          vm.currentTab.visible = false;
        }
      }
    });
    $scope.$on('$includeContentLoaded', function() {
      $scope.$evalAsync(function () {
        vm.loading = false;
        // If originalUrl is set, it is because we are trying to load the error
        // template. This will succeed (it is a local template) so we dont want
        // to reset the unsuccessful counter in that case. We want to reset it
        // only if originalUrl has been erased and we attempted to reload the
        // originalUrl (see below)
        if (vm.currentTab.originalUrl === undefined) {
          vm.unsuccessfulLoad = 0;
          if (vm.retryPromise !== undefined) {
            $timeout.cancel(vm.retryPromise);
            vm.retryPromise = undefined;
            console.log("promise cancelled");
          }
        }
      });
    });
    $scope.$on('$includeContentError', function() {
      console.log("could not load resource");
      // Set the error template (will trigger a includeContentRequest)
      $scope.$evalAsync(function () {
        vm.loading = false;
        // Increment the unsuccessful load counter
        vm.currentTab.unsuccessfulLoad += 1;
        // Save the original URL for later retry
        vm.currentTab.originalUrl = vm.currentTab.url;
        vm.currentTab.url = "error.html"
      });
    });
  }
]);

// Filter to validate an external URL.
// Use it this way: {{ url | trusted }}
testApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
