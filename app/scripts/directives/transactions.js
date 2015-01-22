angular.module('blockchainMonitorApp')
.directive('transactions', function(Blockchain) {
  return {
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs) {

      scope.txList = [];

      Blockchain.getTicker(function(data) {
        if (data.op != 'utx')
          return;
        var total = 0;
        for (var i=0; i<data.x.out.length; i++) {
          total += data.x.out[i].value;
        }
        scope.txList.splice(0, 0, {
          amt: parseFloat(total) / 100000000.0,
          hash: data.x.hash
        })
        while (scope.txList.length > 50) {
          scope.txList.pop();
        }
      })
    },
    template: '<div class="tx-wrapper"><div class="tx" ng-repeat="tx in txList"><strong>{{tx.amt}} BTC</strong> ({{ tx.hash.substring(0, 40) }}...)</div></div>'
  }
})