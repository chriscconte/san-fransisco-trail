(function() {
  var InvestPhase = require('./InvestPhase');
  
  var GameController = function(config) {   
    
    var id       = config.id || '';
    var name     = config.name || 'Player';
    
    var score = 0;
    var level = 1;
    var wallet = 5000;
    var phase = null;
    var isDead = 0;
    
    var gc = { };
    
    
    gc.getId = function() {
      return id;
    };
    
    gc.getWallet = function() {
      return wallet;
    };
    
    gc.setWallet = function(value) {
      return wallet = value;
    };
    
    gc.getLevel = function() {
      return level;
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
      
      if (data.text == 'invest') {
        phase = new InvestPhase(
          {level: level, wallet: wallet}
        );
      }
      else if (data.text == 'hunt') { }
      else {
        phase = null;
      }
    };
    
    gc.getPhase = function() {
      return phase;
    }

    return gc;
  };

  module.exports = GameController;

})();