var assert = require('assert');
var async = require('async');
var GameController = require('../Server/models/GameController');

// Before all suites
before(function(done) {
    done();
});

describe('GameControlller', function() {
  describe('constructor', function() {
    
    before(function(done) {
      done();
    });
    
    it('should construct using given configuration', function(done) {
      
      var config = {
        id: 10,
        name: 'john'
      };
      var game = new GameController(config);
      
      assert.deepEqual(config.id, game.getId());
      assert.deepEqual(config.name, game.getName());
      
      done();
    });
    
    it('should construct using given default configuration', function(done) {
      
      var game = new GameController({id: 10});
      
      assert.deepEqual(10, game.getId());
      assert.deepEqual('Player', game.getName());
      
      done();
    });
    

  });
    
  describe('setName method', function(done) {
      
    it('should set player\'s name', function(done){
      
      var game = new GameController({id: 10});
      game.setName({name: 'john'});
      assert.deepEqual('john', game.getName());
      
      done();

    });
    it('should not set player\'s name if invalid input', function(done){
        
      var game = new GameController({id: 10});
        done();
      
    });
    
  });
  
  describe('increment level method', function(done) {
    
    it('should incrament properly', function(done) {
      var game = new GameController({id: 10});
      game.incrementLevel();
      assert.deepEqual(2, game.getLevel());
      
      done();
    })
  });
  
  describe('set wallet method', function(done) {
    
    it('should mute wallet properly', function(done) {
      var game = new GameController({id: 10});
      game.setWallet(500);
      assert.deepEqual(500, game.getWallet());
      
      done();
    });
      
  });
  
  describe('set phase method', function(done) {
    
    it('should set phase to invest properly', function(done) {
      var game = new GameController({id: 10});
      game.setPhase('invest');
      assert.deepEqual('invest', game.getPhaseName());
      
      done();
    });
    
    it('should set phase to hunt properly', function(done) {
      var game = new GameController({id: 10});
      game.setPhase('hunt');
      game.getPhase();
      assert.deepEqual('hunt', game.getPhaseName());
      
      done();
    });
    
        
    it('should set phase to no phase properly', function(done) {
      var game = new GameController({id: 10});
      game.setPhase('');
      game.getPhase();
      assert.deepEqual('', game.getPhaseName());
      
      done();
    });
  });
  
  describe('get data to post should format properly', function(done) {
    
    it('should return object when dead', function(done) {
      var game = new GameController({id: 10});
      game.die();
      assert.deepEqual({name: 'Player', score: 0}, game.getDataToPost());
      
      done();
    });
    
    it('should return nothing when alive', function(done) {
      var game = new GameController({id: 10});
      assert.deepEqual(null, game.getDataToPost());
      
      done();
    });
  });
});
      