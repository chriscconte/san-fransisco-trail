(function() {

  var InvestPhase = function(config) {
    
    var wallet = config.wallet;
    var level = config.level;
    
    var opportunityToNext = 100;
    var finished = false;
    var begin = false;
    var currentWords = [null, null, null, null];
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
    
    ip.getWords = function() {
      return currentWords;
    }
    
    ip.newWords = function() {
      
      a = Math.round(Math.random()*dictionary.length*2);
      b = Math.round(Math.random()*dictionary.length*2);
      c = Math.round(Math.random()*dictionary.length*2);
      d = Math.round(Math.random()*dictionary.length*2);
      
      currentWords = [
        dictionary[a],
        dictionary[b],
        dictionary[c],
        dictionary[d]
      ]
    };
    
    ip.startHunt = function() {
      begin = true;
    };
    
    ip.endHunt = function() {
      finished = true;
    }
    
    ip.continueToInvest = function() {
       
    };

    return ip;  
    
  };

  module.exports = InvestPhase;

})();