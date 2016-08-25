var testApp = angular.module('testApp', ['oc.lazyLoad', 'ui.router', 'ct.ui.router.extras']);

var lazyLoadStateFactory = function($q, futureState) {
  console.log('load state ', futureState)
  // var state = {
  //   name: futureState.stateName,
  //   templateUrl: futureState.template,
  //   url: futureState.url,
  // };
  // if (futureState.hasOwnProperty('views')) {
  //   state.views = futureState.views;
  // }
  // if (futureState.hasOwnProperty('views')) {
  //   state.views = futureState.views;
  // }
  console.log("futureState:", futureState);
  return $q.when(futureState);
};

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

// Define a service that provide URL prefix to third-party pages
testApp.service('thirdPartyService', function () {
  var service = {};
  service.prefixes = {
    'server2': 'http://3.249.251.52:8001',
  }
  service.getPrefix = function () { return service.prefixes; }
  return service;
});

// Define an interceptor which catch all HTTP request and replace any $XXX$ with
// the appropriate third party URL prefix
function thirdPartyInterceptorService($q, thirdPartyService) {
  prefixRegex = /\$([^\$]*)\$/;

  return {
    // optional method
    request: function(config) {
      // Check if the URL contains the pattern to replace
      if (prefixRegex.test(config.url)) {
        var m = config.url.match(prefixRegex)
        if (!thirdPartyService.getPrefix().hasOwnProperty(m[1])) {
          console.error('unknown third party services: ', m[1],
            '. Configure the thirPartyService with this identifier.')
        } else {
          console.log('before:', config.url);
          config.url = config.url.replace(prefixRegex, thirdPartyService.getPrefix()[m[1]]);
          console.log('after:', config.url);
        }
      }
      return config;
    }
  }
}

testApp.config(['$provide', '$stateProvider', '$urlRouterProvider', '$futureStateProvider', '$sceDelegateProvider', '$httpProvider',
  function ($provide, $stateProvider, $urlRouterProvider, $futureStateProvider, $sceDelegateProvider, $httpProvider) {
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
     // Allow loading from third party web server.
     // /!\ This is dangerous. But it is OK as long as we operate on the local network
     '*',
    ]);
    // Register the interceptor
    $provide.factory('thirdPartyInterceptorService', thirdPartyInterceptorService)
    $httpProvider.interceptors.push('thirdPartyInterceptorService');
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

testApp.controller('StateCtrl', ['$scope', '$location', '$timeout', '$state', '$http', '$futureState', 'thirdPartyService',
  function ($scope, $location, $timeout, $state, $http, $futureState, thirdPartyService) {
    var vm = this;
    vm.$state = $state;
    console.log('state:', $state);
    vm.states = $state.get();

    vm.loadStates = function () {
      console.log('let\'s load state');
      $http.get('$server2$/states').then(function (response) {
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
