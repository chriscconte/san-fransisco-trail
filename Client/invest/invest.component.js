(function (angular) {
  'use strict';
  
  function InvestPartController($scope, $interval, $timeout, socket) {
    
    var ctrl = this;
    
    $scope.player = ctrl.player;
    $scope.walletTemp =  ctrl.player.wallet;
    $scope.stockCount = 0;
    $scope.currentPrice = 0;
    $scope.stockPrice = [$scope.currentPrice];
    $scope.started = false;
    $scope.finished = false;
    $scope.totalBuy = 0;
    $scope.buyCount = 0;
    $scope.averageBuy = 0;
    
    $scope.chartConfig = {
      options: {
        chart: {
          type: 'line',
          animation: Highcharts.svg,
          backgroundColor: "#fde6b7"
        },
        legend: {
          enabled: false
        }
      },
      series: [{
        data: $scope.stockPrice
      }],
      title: {
        text: 'Company X' // TODO: fetch company names?
      },
      xAxis: {
        currentMin: 0,
        currentMax: numPoints,
        title: {text: 'Days'}
      },
      yAxis: {
        currentMin: 0,
        currentMax: 1000,
        title: {text: 'Stock Price ($)'}
      },
      loading: false
    };
    
    $scope.startInvest = function () {
      socket.emit('startInvest', {level: 1});
    };
    
    socket.on('addNewPoint', function(resp) {
      $scope.currentPrice = resp.price;
      $scope.stockPrice.push(resp.price);
    })
    
    socket.on('endInvest', function(resp) {
      $scope.finished = true;
    })
    
    $scope.finishInvest = function() {
      // socket.emit('continueToHunt');
      ctrl.player.mode = 2;
    };
    
    socket.on('buyStock', function (resp) {
      if(resp.success) {
        $scope.walletTemp = resp.wallet;
      }
    });
    $scope.buyStock = function () {
      socket.emit('buyStock');
    };
    
    $scope.buyStockButtonClass = function () {
      if ($scope.walletTemp < $scope.currentPrice) {
        return "btn btn-warning btn-lg";
      }
      else {
        return "btn btn-primary btn-lg";
      }
    };
    
    socket.on('sellStock', function (resp) {
      if(resp.success) {
        $scope.walletTemp = resp.wallet;
      }
    });
    $scope.sellStock = function () {
      socket.emit('sellStock');
    };
    
    $scope.sellStockButtonClass = function () {
      if ($scope.stockCount) {
        return "btn btn-primary btn-lg";
      }
      else {
        return "btn btn-warning btn-lg";
      }
    };
  };

  angular.module('myApp').component('invest', {
    templateUrl: './invest/invest.html',
    controller: InvestPartController,
    bindings: {
      player: '=',
      id: '='
    }
  });
  
})(window.angular);  
      