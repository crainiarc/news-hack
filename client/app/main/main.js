'use strict';

angular.module('newsHackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/newsfeed', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });