'use strict';

/**
 * @ngdoc overview
 * @name blockchainMonitorApp
 * @description
 * # blockchainMonitorApp
 *
 * Main module of the application.
 */
angular
  .module('blockchainMonitorApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    // vendor modules
    'pusher-angular',
    'restangular',
    // application modules
    'blockchainMonitorApp.services.blockchain',
    'blockchainMonitorApp.services.bitstamp'
  ])
  .config(function ($routeProvider, $resourceProvider) {

    $resourceProvider.defaults.stripTrailingSlashes = false;

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/ticker', {
        templateUrl: 'views/ticker.html',
        controller: 'TickerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
