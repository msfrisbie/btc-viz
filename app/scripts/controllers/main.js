'use strict';

/**
 * @ngdoc function
 * @name blockchainMonitorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blockchainMonitorApp
 */
angular.module('blockchainMonitorApp')
  .controller('MainCtrl', function ($scope, Blockchain, Bitstamp) {

    function bitstampCallback(data) {
      $scope.orderBook = convertListings(data);
      // $scope.orderBook.bids = $scope.orderBook.bids.map(listingToObj);
      // $scope.orderBook.asks = $scope.orderBook.asks.map(listingToObj);
    }

    function bitstampRTCallback(data) {
      data = convertListings(data);
      modifyPairs(data.bids, $scope.orderBook.bids);
      modifyPairs(data.asks, $scope.orderBook.asks);
    }

    function convertListings(orderBook) {
      orderBook.bids = orderBook.bids.map(listingToObj);
      orderBook.asks = orderBook.asks.map(listingToObj);
      return orderBook
    }

    function listingToObj(listing) {
      // 0 is dollar price
      // 1 is amount
      return {
        price: parseFloat(listing[0]),
        quantity: parseFloat(listing[1])
      }
    }

    function modifyPairs(newPairs, existingPairs) {
      for (var i=0; i<newPairs.length; i++) {
        var newPair = newPairs[i];
        var found = false;

        for (var j=0; j<existingPairs.length; j++) {

          var existingPair = existingPairs[j];

          if (existingPair.price === newPair.price) {
            // if (newPair.quantity === 0) {
            //   // existingPairs.splice(j, 1);
            //   delete existingPairs[j];
            //   // --j;
            //   found = true;
            //   break;
            // } else {
            existingPair.quantity = newPair.quantity;
            found = true;
            break;
          } else if (existingPair.price < newPair.price) {
            existingPairs.splice(j, 0, newPair)
            found = true;
            break;
          }
        } 

        if (!found && newPair.quantity > 0) {
          console.log('adding', newPair)
          existingPairs.push(newPair);
        }
      }
    }

    Bitstamp.getOrderBook(bitstampCallback);
    Bitstamp.getRTOrderBookDiff(bitstampRTCallback);
  });
