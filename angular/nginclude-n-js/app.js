var testApp = angular.module('testApp', ['oc.lazyLoad']);

testApp.controller('TabCtrl', ['$scope', '$location', '$timeout',
  function ($scope, $location, $timeout) {
    var vm = this;
    vm.tabs = [
      {
        title: 'Acquisition',
        url: 'acquisition.html',
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: true,
      },
      {
        title: 'Review',
        url: 'review.html',
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: true,
      },
      {
        title: 'ECG',
        url: 'ecg.html',
        originalUrl: undefined,
        unsuccessfulLoad: 0,
        visible: false,
      },
    ];
    vm.currentTab = vm.tabs[0];
  }
]);
