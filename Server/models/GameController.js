function() {
  var InvestPhase = require('./InvestPhase');
  var GameController = function(config) {
    
    this.id       = config.id || '';
    this.name     = config.name || 'Player';
    
    this.score = 0;
    this.level = 1;
    this.wallet = 5000;
    this.phase = null;
    this.isDead = 0;

    //this.lastShot = {};
  };

  module.exports = GameController;

  GameController.prototype.setName = function(data) {
    this.name = data.name;
  };
  
  GameController.prototype.invest = function(data) {
    this.phase = new InvestPhase(
      {level: this.level, wallet: this.wallet}
    );
  }

})();