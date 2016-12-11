var assert = require('assert');
var async = require('async');
var InvestPhase = require('../Server/models/InvestPhase');

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
    

  });
    
  describe('BuyStock', function(done) {
      
    it('should properly buy a stock', function(done){
        var investPhase = this.investPhase;
        investPhase.startInvest();
        investPhase.buyStock();
        assert.deepEqual(investPhase.getStockCount(), 1);
        done();

      
    });
    it('should not be able to buy more stocks than wallet amount allows', function(done){
        var config = {
            score: 0,
            wallet: 0,
            level: 1
          };
        var investPhase = new InvestPhase(config);
        
        investPhase.startInvest();
        
        assert.deepEqual(investPhase.buyStock(), false);
        done();
      
    });
    
  });
    
    describe('SellStock', function(done) {
      
    it('should properly sell a stock', function(done){
        var config = {
            score: 0,
            wallet: 5000,
            level: 1
          };
        var investPhase = new InvestPhase(config);
        investPhase.startInvest();
        investPhase.buyStock();
        assert.deepEqual(investPhase.getStockCount(), 1);
        investPhase.sellStock();
        assert.deepEqual(investPhase.getStockCount(), 0);
        done();

      
    });
    it('should not be able to sell more stocks than you have', function(done){
        var config = {
            score: 0,
            wallet: 5000,
            level: 1
          };
        var investPhase = new InvestPhase(config);
        investPhase.startInvest();
        investPhase.buyStock();
        assert.deepEqual(investPhase.getStockCount(), 1);
        investPhase.sellStock();
        assert.deepEqual(investPhase.sellStock(), false);
        done();
      
    });
    
  });
    describe('addPoint', function(done) {
      
        it('should set addPoint shoudl return new stockPrice b/t 0-1000', function(done){
            var config = {
                score: 0,
                wallet: 5000,
                level: 1
              };
            var investPhase = new InvestPhase(config);
            investPhase.startInvest();
            investPhase.addPoint();
            assert.deepEqual(investPhase.addPoint(), investPhase.getStockPrice());
            done();


        });

  });

    describe('startInvest', function(done) {
      
        it('should set begin to true', function(done){
            var config = {
                score: 0,
                wallet: 5000,
                level: 1
              };
            var investPhase = new InvestPhase(config);
            investPhase.startInvest();
            
            assert.deepEqual(investPhase.isBegin(), true);
            done();


        });

  });
    
    describe('endInvest', function(done) {
      
        it('should set finished to false', function(done){
            var config = {
                score: 0,
                wallet: 5000,
                level: 1
              };
            var investPhase = new InvestPhase(config);
            investPhase.startInvest();
            
            assert.deepEqual(investPhase.isFinished(), false);
            done();


        });

  });
    describe('Wallet Deduction', function(done) {
      
        it('should decrement wallet by stockPrice', function(done){
            var config = {
                score: 0,
                wallet: 5000,
                level: 1
              };
            var investPhase = new InvestPhase(config);
            investPhase.startInvest();
            
            investPhase.buyStock();
            
            assert.deepEqual(investPhase.getWallet() < 5000,true);
            done();


        });

  });
    describe('Wallet Addtion', function(done) {
      
        it('should increment wallet by stockPrice after decrementing by stockPrice', function(done){
            var config = {
                score: 0,
                wallet: 5000,
                level: 1
              };
            var investPhase = new InvestPhase(config);
            investPhase.startInvest();
            investPhase.buyStock();
            investPhase.sellStock();
            
            assert.deepEqual(investPhase.getWallet(), 5000);
            done();


        });

  });
    
});
      