(function () {

  'use strict';
  var InvestPhase = function (config) {

    var level = config.level;
    
    var TIME_MS = 3.0e4;
    var TIME_INTERVAL_MS = 100.0;

    var beginTime = 0;
    var finished = false;
    var begin = false;
    var stockPrice = Math.random() * 300;
    var stockCount = 0;

    var ip = {};

    ip.getWallet = function () {
      return config.wallet;
    };

    ip.getScore = function () {
      return config.score;
    };

    ip.getStockPrice = function () {
      return stockPrice;
    };

    ip.getStockCount = function () {
      return stockCount;
    };

    ip.addPoint = function () {
      var delta = (Math.random() - 0.5) * 120;
      var newPrice = Math.abs(stockPrice + delta);

      if (newPrice > 1000) {
        newPrice = newPrice - 2 * delta;
      }
      stockPrice = Math.round(newPrice, 2);
      return stockPrice;
    };

    ip.startInvest = function () {
      begin = true;
      return new Promise(addPointInterval)
    };
    
    function addPointInterval(resolve, reject) {
      setInterval(
        function() {
          var delta = (Math.random() - 0.5) * 120;
          var newPrice = Math.abs(stockPrice + delta);
    
          if (newPrice > 1000) {
            newPrice = newPrice - 2 * delta;
          }
          stockPrice = Math.round(newPrice, 2);
          resolve({
            newPrice: stockPrice,
            finished: false 
          });
        },
        TIME_INTERVAL_MS
      )
      
      setTimeout(
        function() {
          clearInterval();
          resolve({
            newPrice: stockPrice,
            finished: true
          });
        },
        TIME_MS
      );
    }
    


    ip.endInvest = function () {
      config.wallet += stockPrice * stockCount;
      finished = true;
      return config.wallet;
    };

    ip.buyStock = function (data) {
      if (config.wallet > stockPrice) {
        config.wallet -= stockPrice;
        stockCount += 1;
        config.score += 1;
        return true;
      } else {
        return false;
      }
    };

    ip.sellStock = function (data) {
      if (stockCount) {
        config.wallet += stockPrice;
        config.score += 1;
        stockCount -= 1;
        return true;
      } else {
        return false;
      }
    };

    ip.continueToHunt = function () {

    };

    return ip;

  };

  module.exports = InvestPhase;

}());