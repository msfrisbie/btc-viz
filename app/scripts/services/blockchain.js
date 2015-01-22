angular.module('blockchainMonitorApp.services.blockchain', [])
.factory('Blockchain', function($q, $rootScope) {
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = new WebSocket('wss://ws.blockchain.info/inv');
    
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
        ws.send(angular.toJson({op: 'unconfirmed_sub'}));
    };

    // conn.onopen = function () {
    //     console.log('open');
    //     conn.send('{"op":"unconfirmed_sub"}');
    //   }
    
    // ws.onmessage = function(message) {
    //     if (false)
    //         console.log('transaction', JSON.parse(message.data))
    // };

    Service.getTicker = function(cb) {
        ws.onmessage = function(message) {
            cb(JSON.parse(message.data))
        }
    }

    // function sendRequest(request) {
    //   var defer = $q.defer();
    //   var callbackId = getCallbackId();
    //   callbacks[callbackId] = {
    //     time: new Date(),
    //     cb:defer
    //   };
    //   request.callback_id = callbackId;
    //   console.log('Sending request', request);
    //   ws.send(JSON.stringify(request));
    //   return defer.promise;
    // }

    // function listener(data) {
    //   var messageObj = data;
    //   console.log("Received data from websocket: ", messageObj);
    //   // If an object exists with callback_id in our callbacks object, resolve it
    //   if(callbacks.hasOwnProperty(messageObj.callback_id)) {
    //     console.log(callbacks[messageObj.callback_id]);
    //     $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
    //     delete callbacks[messageObj.callbackID];
    //   }
    // }
    // // This creates a new callback ID for a request
    // function getCallbackId() {
    //   currentCallbackId += 1;
    //   if(currentCallbackId > 10000) {
    //     currentCallbackId = 0;
    //   }
    //   return currentCallbackId;
    // }

    // // Define a "getter" for getting customer data
    // Service.getCustomers = function() {
    //   var request = {
    //     type: "get_customers"
    //   }
    //   // Storing in a variable for clarity on what sendRequest returns
    //   var promise = sendRequest(request); 
    //   return promise;
    // }

    return Service;
})