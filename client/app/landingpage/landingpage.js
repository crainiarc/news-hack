'use strict';

angular.module('newsHackApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/landingpage/landingpage.html',
        controller: 'LandingpageCtrl'
      });
  });
