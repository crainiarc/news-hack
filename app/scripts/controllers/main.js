'use strict';

/**
 * @ngdoc function
 * @name newsHackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsHackApp
 */
angular.module('newsHackApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
