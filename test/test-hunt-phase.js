var assert = require('assert');
var async = require('async');
var HuntPhase = require('../Server/models/HuntPhase');

// Constants
var CONFIG = {
  level: 1,
  wallet: 5000
};

// Before all suites
before(function(done) {
  this.hunt = new HuntPhase(CONFIG);
  done();
});

describe('Hunt Phase', function () {
  
  describe('constructor', function () {
    // Things before constructor
    before(function(done) {
      done();
    });

    it('Should instantiate with proper config', function(done) {
      var config = {
        level: 1,
        wallet: 5000
      }
      var hunt = new HuntPhase(config);
      
      assert.deepEqual(hunt.getWallet(), config.wallet);
      assert.deepEqual(hunt.isDead(), false);
      done();
    });

  });

  describe('"startHunt" method', function () {
    // Empty database before the suite
    before(function(done) {
      done();
    });
    
    it('should begin the Hunt', function(done) {
      var hunt = new HuntPhase(CONFIG);
      hunt.startHunt();
      
      assert.equal(hunt.isBegin(), true);
      done();
    });
  });

  describe('"newWord" method', function () {
    
    // Empty database before the suite
    before(function(done) {
      
      done();
    });
    
    it('Should generate a New Word', function(done) {
      
      var hunt = new HuntPhase(CONFIG);
      var original = hunt.getWord();
      
      hunt.newWord();
      
      
      var newWord = hunt.getWord();
      assert.notEqual(original, newWord);
      done();
    });

    it('Should not repeat any words', function(done) {
      var hunt = new HuntPhase(CONFIG);
      var words = [hunt.getWord()];
      
      for(i = 0; i < 10; i++) {
        hunt.newWord();
        var newWord = hunt.getWord();
        words.push(newWord);
        
        for(j = 0; j < i; j++) {
          assert.notEqual(newWord, words[j]);
        }
      }
      
      done();
    });

  });

  describe('"isCorrect" method', function () {
    // Empty database before the suite
    before(function(done) {
      done();
    });
    
    it('should return correct score if correct', function(done) {
      var hunt = new HuntPhase(CONFIG);
      
      var wordObject = hunt.getWord();
      
      var score = hunt.isCorrect({guess: wordObject.word});
      
      assert.equal(wordObject.score, score);
      done();     
    });

    it('should return 0 if incorrect ', function(done) {
      var hunt = new HuntPhase(CONFIG);
      
      var wordObject = hunt.getWord();
      
      var score = hunt.isCorrect({guess: ''});
      
      assert.equal(score, 0);
      done();   
    });

    it('should die if enough words are incorrect', function(done) {
      var hunt = new HuntPhase({level: 1, wallet: 200});
      
      for(i = 0; i < 10; i++) {
        hunt.isCorrect({guess: ''});
        if(hunt.getWallet() > 0) { break; }
      }
      
      assert.equal(hunt.isDead(), true);
      done();
    });

    it('should advance if enough words are correct', function(done) {
      var hunt = new HuntPhase({level: 1, wallet: 200});
      
      for(i = 0; i < 100; i++) {
        hunt.newWord();
        hunt.isCorrect({guess: hunt.getWord().word});
        
        // should break before for loop breaks
        if(hunt.getOpportunityToNext() <= 0) { break; }
      }
      
      assert.equal(hunt.isAdvance(), true);
      done();
    });

    it('should not award points to multiple correct guesses for the same iteration', function(done) {
      done();
    });

  });
});