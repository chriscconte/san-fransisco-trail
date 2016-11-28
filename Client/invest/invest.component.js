(function (angular) {
  'use strict';
  
  function InvestPartController($scope, $interval, $timeout, socket) {
    
    var ctrl = this;
    
    $scope.player = ctrl.player;
    $scope.walletTemp =  ctrl.player.wallet;
    $scope.stockCount = 0;
    $scope.currentPrice = null;
    $scope.stockPrice = [];
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
        currentMax: 300,
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
    socket.on('begin', function(resp){
      $scope.started = true;
      $scope.currentPrice = resp.price;
      $scope.stockPrice.push($scope.currentPrice);
    })
    
    socket.on('addNewPoint', function(resp) {
      $scope.currentPrice = resp.price;
      $scope.stockPrice.push(resp.price);
    })
    
    socket.on('endInvest', function(resp) {
      $scope.walletTemp = resp.wallet;
      $scope.finished = true;
    })
    
    $scope.finishInvest = function() {
      // socket.emit('continueToHunt');
      ctrl.player.mode = 2;
    };
    
    socket.on('buyStock', function (resp) {
      if(!resp.success) {
        document.getElementById('buyStock').class = "btn btn-warning btn-lg";
        $timeout(
          function() {
            document.getElementById('buyStock').class = "btn btn-primary btn-lg";
          },
          100
        );
      }
      else {
        $scope.buyCount += 1;
        $scope.totalBuy += $scope.currentPrice;
        $scope.averageBuy = Math.round($scope.totalBuy / $scope.buyCount, 2);
      }
      
      $scope.stockCount = resp.stockCount;
      $scope.walletTemp = resp.wallet;
    });
    
    
    $scope.buyStock = function () {
      socket.emit('buyStock');
    };
    
    socket.on('sellStock', function (resp) {
      if(!resp.success) {
        document.getElementById('sellStock').class = "btn btn-warning btn-lg";
        $timeout(
          function() {
            document.getElementById('sellStock').class = "btn btn-primary btn-lg";
          },
          100
        );
      }
      
      $scope.stockCount = resp.stockCount;
      $scope.walletTemp = resp.wallet;
    });
    
    $scope.sellStock = function () {
      socket.emit('sellStock');
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
      