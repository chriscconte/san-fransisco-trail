(function() {

  var HuntPhase = function(config) {
    
    var wallet = config.wallet;
    var level = config.level;
    
    var opportunityToNext = 100;
    var finished = false;
    var begin = false;
    var currentWord = null;
    var dictionary = [
      {
        word: "att",
        score: 10
      },
      {
        word: "verizon",
        score: 20
      },
      {
        word: "apple",
        score: 10
      },
      {
        word: "amazon",
        score: 10
      },
      {
        word: "microsoft",
        score: 20
      },
      {
        word: "alphabet",
        score: 20
      },
      {
        word: "twitter",
        score: 15
      },
      {
        word: "comcast",
        score: 10
      }
    ];
    
    var ip = {};
    
    ip.getWallet = function() {
      return wallet;
    }
    
    ip.getWord = function() {
      return currentWords;
    }
    
    ip.getOpportunityToNext = function() {
      return opportunityToNext;
    }
    
    ip.isCorrect = function(resp) {
      if(resp.guess === currentWord.word) {
        opportunityToNext -= currentWord.score;
        return currentWord.score;
      }
      else {
        finished = true;
        return 0;
      }
    }
    
    ip.newWord = function() {
      a = Math.floor(Math.random()*dictionary.length);
      currentWords = dictionary[a];
    };
    
    ip.startHunt = function() {
      begin = true;
    };
    
    ip.endHunt = function() {
      finished = true;
    }
    
    return ip;  
    
  };

  module.exports = HuntPhase;

})();