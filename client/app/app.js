'use strict';

angular.module('newsHackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'angular-packery'
])
  .filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })
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
