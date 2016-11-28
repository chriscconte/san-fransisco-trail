(function() {

  var InvestPhase = function(config) {
    
    var wallet = config.wallet;
    var level = config.level;
    
    var beginTime = 0;
    var finished = false;
    var begin = false;
    var stockPrice = Math.random() * 300;
    var stockCount = 0;
    
    var ip = {};
    
    ip.getWallet = function () {
      return wallet;
    }
    
    ip.getStockPrice = function () {
      return stockPrice;
    }
    
    ip.getStockCount = function () {
       return stockCount;
    }
    
    ip.addPoint = function() {
      var delta = (Math.random() - 0.5) * 120;
      var newPrice = Math.abs(stockPrice + delta);
            
      if (newPrice > 1000) {
        newPrice = newPrice - 2 * delta;
      };
      return stockPrice = Math.round(newPrice, 2);
    };
    
    ip.startInvest = function() {
      begin = true;
    };
    
    ip.endInvest = function() {
      wallet += stockPrice * stockCount;
      finished = true;
    }
    
    ip.buyStock = function(data) {
      if (wallet > stockPrice) {
        wallet -= stockPrice;
        stockCount += 1;
        return true;
      }
      else {
        return false;
      }
    };
    
    ip.sellStock = function(data) {
      if (stockCount) {
        wallet += stockPrice;
        stockCount -= 1;
        return true;
      }
      else {
        return false;
      }
    };
    
    ip.continueToHunt = function() {
       
    };

    return ip;
    
  };

  module.exports = InvestPhase;

})();