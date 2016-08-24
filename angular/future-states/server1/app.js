var testApp = angular.module('testApp', ['oc.lazyLoad', 'ui.router', 'ct.ui.router.extras']);

var EXTERNAL_URL = 'http://3.249.251.52:8001';

var lazyLoadStateFactory = function($q, futureState) {
  console.log('load state ', futureState)
  var state = {
    name: futureState.stateName,
    templateUrl: futureState.template,
    url: futureState.url,
  };
  return $q.when(state);
};

testApp.config(['$stateProvider', '$urlRouterProvider', '$futureStateProvider', '$sceDelegateProvider',
  function ($stateProvider, $urlRouterProvider, $futureStateProvider, $sceDelegateProvider) {
    $stateProvider.state('state1', {
      url: '/',
      templateUrl: 'state1.html',
    });
    $urlRouterProvider.otherwise(function($injector, $location){
      console.log('otherwise $location:', $location);
      $injector.get('$state').go('state1');
    });
    // Register the future state factory
    $futureStateProvider.stateFactory('lLoad', lazyLoadStateFactory);
    // Add third party in the whitelist
    $sceDelegateProvider.resourceUrlWhitelist([
     // Allow same origin resource loads.
     'self',
     // Allow loading from our assets domain.  Notice the difference between * and **.
     EXTERNAL_URL + '/**',
    ]);
}]);

testApp.run(['$rootScope', function ($rootScope) {
  // Event logging
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log(event.name, fromState.name, toState.name)
  })
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    console.log(event.name, fromState.name, toState.name)
  })
  $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
    console.log(event.name, unfoundState.name)
  })
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.log(event.name, fromState.name, toState.name, error)
  })
  $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
    console.log(event.name, oldUrl, '->', newUrl)
  })
  $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
    console.log(event.name, oldUrl, '->', newUrl)
  })
}]);

// Let's define a service we will use in a dynamically loaded page
testApp.service('someService', function () {
  var service = {};
  service.value = 42;
  service.getObject = function() { return service; };
  service.increment = function() {
    console.log('increment');
    service.value++;
  };
  return service;
});

testApp.controller('StateCtrl', ['$scope', '$location', '$timeout', '$state', '$http', '$futureState',
  function ($scope, $location, $timeout, $state, $http, $futureState) {
    var vm = this;
    vm.server = EXTERNAL_URL;
    vm.$state = $state;
    console.log('state:', $state);
    vm.states = $state.get();

    vm.loadStates = function () {
      console.log('let\'s load state');
      $http.get(vm.server + '/states').then(function (response) {
        console.log(response.data);
        response.data.forEach(function (fstate) {
          console.log('registering', fstate);
          $futureState.futureState(fstate);
        });
        console.log('we\'re done here');
        console.log('$state.get()', $state.get());
        console.log('$futureState.get()', $futureState.get());
        vm.states = $state.get().concat(Object.keys($futureState.get()).map(function(key) { return $futureState.get()[key]; })).filter(function (item) {
          return item.name !== '';
        });
        console.log('vm.states:', vm.states);
      }, function (response) {
        console.log('There was an error loading the states');
      });
    }

    vm.changeState = function (state) {
      console.log("change to state", state.name);
      $state.go(state.name);
    }
  }
]);
