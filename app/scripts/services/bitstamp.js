angular.module('blockchainMonitorApp.services.bitstamp', [])
.factory('Bitstamp', function($pusher, $http, $resource) {
  var client = new Pusher('de504dc5763aeef9ff52')
    , pusher = $pusher(client)
    , orderBookChannel = pusher.subscribe('diff_order_book')
    , tickerChannel = pusher.subscribe('live_trades');


  function getOrderBook(cb) {
    $http.get('/bitstamp').success(cb);
  }


  function getRTOrderBookDiff(cb) {
    orderBookChannel.bind('data', cb);
  }

  function getTicker(cb) {
    tickerChannel.bind('trade', cb);
  }

  return {
    getOrderBook: getOrderBook,
    getRTOrderBookDiff: getRTOrderBookDiff,
    getTicker: getTicker
  };
});
