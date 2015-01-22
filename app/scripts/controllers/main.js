'use strict';

/**
 * @ngdoc function
 * @name blockchainMonitorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blockchainMonitorApp
 */
angular.module('blockchainMonitorApp')
  .controller('MainCtrl', function ($scope, $timeout, Blockchain, Bitstamp) {

    function getWatchers (element) {
        if (!element) { return []; }
        // convert to a jqLite/jQuery element
        // angular.element is idempotent
        var el = angular.element(
                // defaults to the body element
                element || document.getElementsByTagName('body')
            )
            // extract the DOM element data
          , elData = el.data()
            // initalize returned watchers array
          , watchers = [];

        // AngularJS lists watches in 3 categories
        // each contains an independent watch list
        angular.forEach([
                // general inherited scope
                elData.$scope,
                // isolate scope attached to templated directive
                elData.$isolateScope,
                // isolate scope attached to templateless directive
                elData.$isolateScopeNoTemplate
            ],
            function (scope) {
                // each element may not have a scope class attached
                if (scope) {
                    // attach the watch list
                    watchers = watchers.concat(scope.$$watchers || []);
                }
            }
        );

        // recurse through DOM tree
        angular.forEach(el.children(), function (childEl) {
            watchers = watchers.concat(getWatchers(childEl));
        });

        return watchers;
    };

    function bitstampCallback(data) {
      $scope.orderBook = convertListings(data);
      // $scope.orderBook.bids = $scope.orderBook.bids.map(listingToObj);
      // $scope.orderBook.asks = $scope.orderBook.asks.map(listingToObj);
      // $scope.globalWatchCount = getWatchers(
      // );
      Bitstamp.getRTOrderBookDiff(bitstampRTCallback);
    }

    $scope.bidTrackData = {
      last20: [200.0],
      buffer: []
    };
    $scope.askTrackData = {
      last20: [200.0],
      buffer: []
    };

    function bitstampRTCallback(data) {
      data = convertListings(data);
      addPairs(data)
      modifyPairs(data.bids, $scope.orderBook.bids);
      modifyPairs(data.asks, $scope.orderBook.asks);

      for (var i=0; i < data.bids.length; i++) {
        if (data.bids.length < 10) {
          $scope.bidTrackData.buffer.push(data.bids[i].price);
        }
        $scope.bidTrackData.last20.push(data.bids[i].price);
        if ($scope.bidTrackData.last20.length > 20) {
          $scope.bidTrackData.last20.pop(0);
        }
      }

      for (var i=0; i < data.asks.length; i++) {
        if (data.asks.length < 10) {
          $scope.askTrackData.buffer.push(data.asks[i].price);
        }
        $scope.askTrackData.last20.push(data.asks[i].price);
        if ($scope.askTrackData.last20.length > 20) {
          $scope.askTrackData.last20.pop(0);
        }
      }

      $scope.activeBidCount = $scope.orderBook.bids.filter(function (bid) {
        return bid.quantity > 0;
      }).length
      $scope.activeAskCount = $scope.orderBook.asks.filter(function (ask) {
        return ask.quantity > 0;
      }).length

      // $scope.globalWatchCount = getWatchers(document);
    }

    function convertListings(orderBook) {
      orderBook.bids = orderBook.bids.map(listingToObj);
      orderBook.asks = orderBook.asks.reverse().map(listingToObj);
      return orderBook;
    }

    function listingToObj(listing) {
      // 0 is dollar price
      // 1 is amount
      return {
        price: parseFloat(listing[0]),
        quantity: parseFloat(listing[1]),
        lastUpdated: new Date()
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
            existingPair.lastUpdated = newPair.lastUpdated;
            found = true;
            break;
          } else if (existingPair.price < newPair.price) {
            existingPairs.splice(j, 0, newPair)
            found = true;
            break;
          }
        } 

        if (!found && newPair.quantity > 0) {
          // console.log('adding', newPair)
          existingPairs.push(newPair);
        }
      }
    }

    $scope.updateWatchCount = function() {
      $scope.globalWatchCount = getWatchers(document);
    }

    function addPairs(pairs) {
      $scope.newPairs.splice(0, 0, pairs);
      while ($scope.newPairs.length > 15) {
        $scope.newPairs.pop();
      }
    }

    function getDensity() {
      $timeout(function() {
        $scope.watchDensity = getWatchers($('.ask-bid')[0]).length;
        if (!$scope.watchDensity)
          getDensity();
      }, 1000)
    }

    $scope.newPairs = []

    getDensity();

    Bitstamp.getOrderBook(bitstampCallback);
  });
