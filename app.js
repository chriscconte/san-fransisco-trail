/*jslint node: true */
/*jslint plusplus: true */
'use strict';
/*global angular */
/*global Highcharts */
// Declare app level module which depends on views, and components
angular.module('myApp', ['highcharts-ng'])
  .controller('myCtrl', function ($scope, $interval) {
  
    $('#myModal').modal('show');
    
    $scope.wallet = 5000.0;
    $scope.stockCount = 0;
    $scope.currentStockPrice = 0;
    $scope.timer = 0;
    $scope.stockPriceTime = new Array(1);
  
    var TIME_MS = 3e4,
      TIME_INTERVAL_MS = 100.0,
      numPoints = TIME_MS / TIME_INTERVAL_MS,
      i = 1;

    // Starting stock
    $scope.stockPriceTime[0] = {x: 0, y: Math.round(Math.random() * 1000, 2)};
    // Construct random Stock
    for (i; i < numPoints; i++) {
      var delta = (Math.random() - 0.5) * 120,
        newPrice = Math.abs($scope.stockPriceTime[i - 1].y + delta);
        if (newPrice > 1000) {
          newPrice = newPrice - 2*delta;
        }
      $scope.stockPriceTime.push({x: i, y: Math.round(newPrice, 2)});
    }

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
        data: [$scope.stockPriceTime[0]]
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
      var series = $scope.chartConfig.series[0];
      $interval(function () {
        series.data = series.data.concat([$scope.stockPriceTime[$scope.timer]]);
        $scope.timer++;
      }, TIME_INTERVAL_MS, numPoints - 1);
    };

    var totalBuy = 0,
      buyCount = 0;
    $scope.buyStock = function () {
      if ($scope.stockPriceTime[$scope.timer].y < $scope.wallet) {
        buyCount++;
        totalBuy += $scope.stockPriceTime[$scope.timer].y;
        $scope.averageBuy = Math.round(totalBuy / buyCount, 2);
        $scope.wallet -= $scope.stockPriceTime[$scope.timer].y;
        $scope.stockCount++;
        return $scope.wallet;
      } else {
        return 0;
      }
    };

    $scope.sellStock = function () {
      if ($scope.stockCount) {
        $scope.stockCount--;
        $scope.wallet += $scope.stockPriceTime[$scope.timer].y;
        return $scope.wallet;
      } else {
        return 0;
      }
    };
  });