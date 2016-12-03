(function () {

  'use strict';
  var HuntPhase = function (config) {
    
    var wallet = config.wallet;
    var level = config.level;
    
    var opportunityToNext = 100;
    var dead = false;
    var begin = false;
    var advance = false;
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
    var currentWord = dictionary[0];
    
    var ip = {};
    
    ip.getWallet = function () {
      return config.wallet;
    };
    
    ip.getWord = function () {
      return currentWord;
    };
    
    ip.isAdvance = function () {
      return advance;
    };
    
    ip.isDead = function () {
      return dead;
    };
    
    ip.die = function () {
      dead = true;
    };
    
    ip.getOpportunityToNext = function () {
      return opportunityToNext;
    };
    
    ip.isCorrect = function (resp) {
      if (resp.guess === currentWord.word) {
        opportunityToNext -= currentWord.score;
        config.score += currentWord.score;
        if (opportunityToNext <= 0) {
          advance = true;
        }
        return currentWord.score;
      } else {
        config.wallet -= currentWord.score * 100;
        if (config.wallet <= 0) {
          config.wallet = 0;
          dead = true;
        }
        return 0;
      }
    };
    
    ip.newWord = function () {
      var a = Math.floor(Math.random() * dictionary.length);
      currentWord = dictionary[a];
    };
    
    ip.startHunt = function () {
      begin = true;
    };
    
    return ip;
    
  };

  module.exports = HuntPhase;

}());