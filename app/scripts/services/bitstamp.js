angular.module('blockchainMonitorApp.services.bitstamp', [])
.factory('Bitstamp', function($pusher, $http, $resource) {
  var client = new Pusher('de504dc5763aeef9ff52')
    , pusher = $pusher(client)
    , channel = pusher.subscribe('diff_order_book');

  // initialize with first full book request

  // $http.jsonp(
  //   'https://www.bitstamp.net/api/order_book/',
  //   { callback: 'JSON_CALLBACK' }
  // ).success(function(data, status, headers, config) {
  //   console.log(data)
  // })

  // get_json_feed();

  // function get_json_feed() {
  //     $.ajax({
  //         url: '/bitstamp',
  //         type: 'GET',
  //         dataType: 'json',
  //         error: function(xhr, status, error) {
  //             alert("error");
  //         },
  //         success: function(json) {
  //             alert("success");
  //         }
  //     });
  // }

  // var Bitstamp = $resource(
  //   'https://www.bitstamp.net/api/order_book/', 
  //   {},
  //   {
  //     get: { 
  //       method: 'JSONP', 
  //       params: {
  //         // callback: 'JSON_CALLBACK'
  //       } 
  //     }
  //   }
  // );

  // console.log('123')

  function getOrderBook(cb) {
    $http.get('/bitstamp').success(cb);
  }

  // Bitstamp.get();

  // $.getJSON('https://www.bitstamp.net/api/order_book/', function(data) {
  //   console.log(data)

  //   // var html = '<h2>Bids</h2>';
  //   // for(i=0;i<500;i++) {
  //   //     html = html + '<div class="bid" amount="' + data['bids'][i][1] + '" price="' + data['bids'][i][0] + '">' + data['bids'][i][1] + ' BTC @ ' + data['bids'][i][0] + ' USD' + '</div>';
  //   //     bids_placeholder.html( html );
  //   // }

  //   // var html = '<h2>Asks</h2>';
  //   // for(i=0;i<500;i++) {
  //   //     html = html + '<div class="ask" amount="' + data['asks'][i][1] + '" price="' + data['asks'][i][0] + '">' + data['asks'][i][1] + ' BTC @ ' + data['asks'][i][0] + ' USD' + '</div>';
  //   //     asks_placeholder.html( html );
  //   // }

  // });

  function getRTOrderBookDiff(cb) {
    channel.bind('data', cb);
  }

  return {
    getOrderBook: getOrderBook,
    getRTOrderBookDiff: getRTOrderBookDiff
  };
});
