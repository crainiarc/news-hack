'use strict';

angular.module('newsHackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/landingpage', {
        templateUrl: 'app/landingpage/landingpage.html',
        controller: 'LandingpageCtrl'
      });
  });
