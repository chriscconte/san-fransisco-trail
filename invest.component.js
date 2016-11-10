(function (angular) {
  'use strict';
  
  function InvestPartController($scope, $interval, $timeout) {
    
    var TIME_MS = 3.0e4,
      TIME_INTERVAL_MS = 100.0,
      numPoints = TIME_MS / TIME_INTERVAL_MS,
      ctrl = this;
    $scope.player = ctrl.player;
    $scope.walletTemp =  ctrl.player.wallet;
    $scope.stockCount = 0;
    $scope.currentPrice = Math.round(Math.random() * 1000, 2);
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
      $scope.started = true;
      $interval(
        function () {
          var stockPrice = $scope.chartConfig.series[0].data,
              delta = (Math.random() - 0.5) * 120,
              newPrice = Math.abs(stockPrice[stockPrice.length - 1] + delta);
          
          if (newPrice > 1000) {
            newPrice = newPrice - 2 * delta;
          };
          $scope.currentPrice = Math.round(newPrice, 2);
          stockPrice.push($scope.currentPrice);
        },
        TIME_INTERVAL_MS,
        numPoints - 1
      );
      $timeout(function() { $scope.finished = true; }, TIME_MS + 200.0);
    };
    
    $scope.finishInvest = function() {
      ctrl.player.wallet = $scope.walletTemp + $scope.stockCount * $scope.currentPrice;
      ctrl.player.mode = 2;
    };
    
    $scope.buyStock = function () {
      $scope.buyCount += 1;
      $scope.totalBuy += $scope.currentPrice;
      $scope.averageBuy = Math.round($scope.totalBuy / $scope.buyCount, 2);
      // buy 
      $scope.walletTemp -= $scope.currentPrice;
      $scope.stockCount += 1;
    };
    
    $scope.buyStockButtonClass = function () {
      if ($scope.walletTemp < $scope.currentPrice) {
        return "btn btn-warning btn-lg";
      }
      else {
        return "btn btn-primary btn-lg";
      }
    };
    
    $scope.sellStock = function () {
      if ($scope.stockCount) {
        $scope.stockCount -= 1;
        $scope.walletTemp += $scope.currentPrice;
      } else {
        // TODO Turn button Red
        document.getElementById('sell-stock').class = "btn btn-danger";
        $timeout(function () {
          document.getElementById('sell-stock').class = "btn btn-primary";
        }, 100);
      }
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
    templateUrl: 'invest.html',
    controller: InvestPartController,
    bindings: {
      player: '='
    }
  });
  
})(window.angular);  
      