(function (angular) {
  'use strict';
  
  function InvestPartController($scope, $interval, $timeout, socket) {
    
    var ctrl = this;
    
    $scope.player = ctrl.player;
    $scope.walletInit =  ctrl.player.wallet;
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
          backgroundColor: "#000000",
          style: {
            "fontFamily":"PT_Mono;",
            "color": "#32cd32;"
          }
        },
        legend: {
          enabled: false
        }
      },
      colors: ["#32cd32", "#ff0000"],
      
      series: [{
        data: $scope.stockPrice,
        color: "#32cd32"
      }],
      title: {
        text: 'Company X', // TODO: fetch company names?
        color: "#32cd32"
      },
      xAxis: {
        currentMin: 0,
        currentMax: 300,
        title: {text: 'Time (100ms)'}
      },
      yAxis: 
        {
          currentMin: 0,
          currentMax: 1000,
          title: {text: 'Stock Price ($)'}
        },
        
      loading: false
    };
    
    
    $scope.currentWallet = [ctrl.player.wallet];
    $scope.currentStockValue = [0];
    $scope.statsChartConfig = {
      options: {
        chart: {
          type: 'column',
          animation: false,
          backgroundColor: "#000000",
          style: {
            "fontFamily":"PT_Mono;",
            "color": "#32cd32;"
          }
        },
        legend: {
          enabled: false
        }
      },
      title: {
        text: 'wealth', // TODO: fetch company names?
        color: "#32cd32"
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
        animation: false,
      },
      xAxis: {
        categories: ['cash', 'stock', 'overall']
      },
      yAxis: {
        title: {text: 'wealth ($)'},
        max: ctrl.player.wallet * 6,
        stackLabels: {
          enabled: true
        }
      },
      series: [
        {
          name: 'cash',
          data: [ctrl.player.wallet]
        },
        {
          name: 'stock',
          data: [0]
        },
        {
          name: 'overall',
          data: [0]
        }
      ],
      loading: false
    };
    
    var updateStats = function(resp) {
      $scope.statsChartConfig.series[0].data = [resp.wallet];
      $scope.statsChartConfig.series[1].data = [$scope.currentPrice * resp.stockCount];
      $scope.statsChartConfig.series[2].data = [resp.wallet + $scope.currentPrice * resp.stockCount];
    }
    $scope.startInvest = function () {
      socket.emit('startInvest', {level: 1});
    };
    socket.on('begin', function(resp){
      $scope.started = true;
      $scope.currentPrice = resp.price;
      $scope.stockPrice.push($scope.currentPrice);
    });
    
    socket.on('addNewPoint', function(resp) {
      updateStats(resp);
      
      $scope.currentPrice = resp.price;
      $scope.stockPrice.push(resp.price);
    });
    
    socket.on('endInvest', function(resp) {
      ctrl.player.wallet = resp.wallet;
      $scope.finished = true;
    });
    
    $scope.finishInvest = function() {
      // socket.emit('continueToHunt');
      ctrl.player.mode = 2;
    };
    
    socket.on('buyStock', function (resp) {
      updateStats(resp);
      if(!resp.success) {
        // BUGBUG: cannot set property 'class' of null 
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
        ctrl.player.score = resp.score;
      }
      
      $scope.stockCount = resp.stockCount;
      ctrl.player.wallet = resp.wallet;
      $scope.$ctrl.player.wallet = resp.wallet;
    });
    
    $scope.buyStock = function () {
      socket.emit('buyStock');
    };
    
    socket.on('sellStock', function (resp) {
      updateStats(resp);
      if(!resp.success) {
        document.getElementById('sellStock').class = "btn btn-warning btn-lg";
        $timeout(
          function() {
            document.getElementById('sellStock').class = "btn btn-primary btn-lg";
          },
          100
        );
      }
      ctrl.player.score = resp.score;
      $scope.stockCount = resp.stockCount;
      ctrl.player.wallet = resp.wallet;
      $scope.$ctrl.player.wallet = resp.wallet;
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
      wallet: '=',
      id: '='
    }
  });
  
})(window.angular);  
      