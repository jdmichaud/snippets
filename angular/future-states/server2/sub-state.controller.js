'use strict';

var subStateController = function ($scope, $state) {
  var vm = this;
  vm.$state = $state;
};

console.log('register controller SubStateController');
angular.module('testApp').controller('SubStateController', ['$scope', '$state', subStateController]);
