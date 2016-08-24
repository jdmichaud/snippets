'use strict';

/**
 * Decription of the ldm-groups-control directive here
 * @param
 * @constructor
 * @alias module:directive/ldm-groups-control
 */
var someDirectiveDirective = function () {
  return {
    // 'E' - only matches element name
    restrict: 'E',
    // To access the scope outside
    transclude: true,
    scope: {
      attribute: '@',
    },
    templateUrl: 'http://3.249.251.52:8001/some-directive.directive.html',
    controllerAs: 'vm',
    controller: function (someService) {
      var vm = this;
      vm.object = someService.getObject();
      vm.increment = someService.increment;
    },
  };
};

console.log('register directive someDirective');
angular.module('testApp').directive('someDirective', someDirectiveDirective);
