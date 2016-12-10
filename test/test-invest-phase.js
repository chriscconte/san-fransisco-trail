var assert = require('assert');
var async = require('async');
var InvestPhase = require('./Server/models/InvestPhase');

// Constants
var DBINDEX = 15;
var PAGESIZE = 5;

// Before all suites
before(function(done) {

  this.config = {
    score: 0,
    wallet: 5000,
    level: 1
  };
  
  this.investPhase = new InvestPhase(config);
});

describe('InvestPhase', function() {
  describe('constructor', function() {
    
    before(function(done) {
      
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
    
    it('should properly instantiate with default properties', function(done){
      var invest = new InvestPhase(config);
      
    });
    
  describe('BuyStock', function(done) {
    
  })
  

});
      