'use strict';

/**
 * @ngdoc function
 * @name blockchainMonitorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the blockchainMonitorApp
 */
angular.module('blockchainMonitorApp')
  .controller('TickerCtrl', function ($scope, Bitstamp, Blockchain) {
    // console.log('jakejake')
    // Bitstamp.getTicker(function(data) {
    //   console.log(data);
    // })
    Blockchain.getTicker(function(data) {
      console.log('mydata', data)
    })

  });
