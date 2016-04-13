var testApp = angular.module('testApp', ['pascalprecht.translate']);

testApp.config(['$translateProvider',
  function ($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'locale-',
        suffix: '.json'
      })
      .preferredLanguage('en')
      .useSanitizeValueStrategy('escape');
  }
]);

function TestCtrl($scope, $translate) {
  var vm = this;
  vm.lang = 'en';

  $scope.$watch(
    function () { return vm.lang; },
    function () { $translate.use(vm.lang); }
  );
};

testApp.controller('TestCtrl', ['$scope', '$translate', TestCtrl]);
