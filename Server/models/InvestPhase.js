(function() {

  var InvestPhase = function(config) {
    
    this.wallet = config.wallet;
    this.level = config.level;
    
    this.beginTime = 0;
    this.finished = false;
    this.begin = false;
    this.stockPrice = 0;
    this.stockCount = 0;
  };

  module.exports = InvestPhase;
  
  InvestPhase.prototype.addPoint = function() {
    var delta = (Math.random() - 0.5) * 120,
    var newPrice = Math.abs(this.stockPrice + delta);
          
    if (newPrice > 1000) {
      newPrice = newPrice - 2 * delta;
    };
    
    this.stockPrice = Math.round(newPrice, 2);
  }

  InvestPhase.prototype.startInvest = function(data) {
    this.begin = true;
  };
  
  InvestPhase.prototype.endInvest = function() {
    this.finished = true;
  }

  InvestPhase.prototype.buyStock = function(data) {
    if (this.wallet > this.stockPrice) {
      this.wallet -= this.stockPrice;
      this.stockCount += 1;
      return true;
    }
    else {
      return false;
    }
  };

  InvestPhase.prototype.sellStock = function(data) {
    if (this.stockCount) {
      this.wallet += this.stockPrice;
      this.stockCount -= 1;
      return true;
    }
    else {
      return false;
    }
  };

  InvestPhase.prototype.continueToHunt = function() {
  };

})();