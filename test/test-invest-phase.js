var assert = require('assert');
var async = require('async');
var InvestPhase = require('../Server/models/InvestPhase');

// Constants
var DBINDEX = 15;
var PAGESIZE = 5;

// Before all suites
before(function(done) {

  
  
  this.investPhase = new InvestPhase({
    score: 0,
    wallet: 5000,
    level: 1
  });
    done();
});

describe('InvestPhase', function() {
  describe('constructor', function() {
    
    before(function(done) {
      done();
    });
    
    it('should construct using given configuration', function(done) {
      
      var config = {
        score: 0,
        wallet: 5000,
        level: 1
      };
      var invest = new InvestPhase(config);
      
      assert.deepEqual(config.score, invest.getScore());
      assert.deepEqual(config.wallet, invest.getWallet());
      
      done();
    });
    
    it('should properly instantiate with default properties.', function(done){
      var invest = new InvestPhase(config);
      
    });
  });
    
  describe('BuyStock', function(done) {
      
    it('should properly buy a stock', function(done){
        var investPhase = this.investPhase;
        investPhase.startInvest();
        investPhase.buyStock();
         assert.deepEqual(investPhase.getStockCount(), 1);
        investPhase.end
        done();

      
    });
    it('should not be able to buy more stocks than wallet amount allows', function(done){

        done();

      
    });
    
  });
  

});
      