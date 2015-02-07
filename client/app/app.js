'use strict';

angular.module('newsHackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/auth/facebook', {
        redirectTo: '/auth/facebook'
      })

      .when('/auth/facebook/callback/:token', {
        redirectTo: '/auth/facebook/callback/:token'
      })

      .when('/pullmoidata', {
        redirectTo: '/pullmoidata'
      })

      .when('/feed', {
        redirectTo: '/feed'
      })
      .otherwise({
        redirectTo: '/'
      });

    // $locationProvider.html5Mode(true);
  });
