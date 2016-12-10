(function () {

  'use strict';
  var HuntPhase = function (config) {
    
    var fs = require('fs');
    const path = require('path');
    
    
    
    var wallet = config.wallet;
    var level = config.level;
    
    var opportunityToNext = 100;
    var dead = false;
    var begin = false;
    var advance = false;
    var dictionary = [];
    var companies = fs.readFileSync('Server/company_names.txt').toString().split('\r');
    
    for(var i = 0; i < companies.length; i++) {
      dictionary.push({
        word: companies[i],
        score: companies[i].length * 2
      })
    }
    
    var alreadyUsed = [0];
    var currentWord = dictionary[0];
    
    var ip = {};
    
    ip.clearData = function() {
      lineReader.close();
      dictionary = [];
    }
    
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
      var a;
      do {
        a = Math.floor(Math.random() * dictionary.length);
      } while (alreadyUsed.indexOf(a) !== -1);
      
      alreadyUsed.push(a);
      
      if(alreadyUsed.length === dictionary.length) {
        alreadyUsed = [];
      }
      currentWord = dictionary[a];
    };
    
    ip.startHunt = function () {
      begin = true;
    };
    
    ip.isBegin = function () {
      return begin;
    };
    
    return ip;
    
  };

  module.exports = HuntPhase;

}());