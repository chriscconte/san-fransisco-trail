(function() {
  var InvestPhase = require('./InvestPhase');
  var HuntPhase = require('./HuntPhase');
  
  var GameController = function(config) {   
    
    var id       = config.id || '';
    var name     = config.name || 'Player';
    
    var score = 0;
    var level = 1;
    var wallet = 5000;
    var phase = null;
    var isDead = false;
    
    var gc = { };
    
    gc.getId = function() {
      return id;
    };
    
    gc.getScore = function() {
      return score;
    };
    
    gc.getLevel = function() {
      return level;
    };
    
    gc.getWallet = function() {
      return wallet;
    };
    
    gc.setScore = function(newScore) {
      score = newScore;
      return score;
    }
    
    gc.die = function() {
      isDead = true;
    }
    
    gc.setWallet = function(value) {
      return wallet = value;
    };
    
    gc.incrementLevel = function() {
      level += 1;
    };
    
    gc.getName = function() {
      return name;
    };
    
    gc.setName = function(data) {
      name = data.name;
    };
    
    gc.setPhase = function(data) {
      
      if (data === 'invest') {
        phase = new InvestPhase(
          {level: level, wallet: wallet, score: score}
        );
      }
      else if (data === 'hunt') { 
        phase = new HuntPhase(
          {level: level, wallet: wallet, score: score}
        );
      }
      else {
        phase = null;
      }
    };
    
    gc.getPhase = function() {
      return phase;
    };
    
    gc.getDataToPost = function() {
      if (isDead) {
        return {name: name, score: score};
      }
      else {
        return null;
      }
    };

    return gc;
  };

  module.exports = GameController;

})();