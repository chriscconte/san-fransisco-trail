module.exports = 
(function(app, io) {
  var util = require('util');
  var GameController = require('./../models/GameController');
  var IP = require('./../models/InvestPhase');
  var HP = require('./../models/HuntPhase');
  
  var assert = require('assert');
  var async = require('async');
  var redis = require('redis');
  var Leaderboard = require('leaderboard');
  
  var DBINDEX = 15;

  g = {
    io: undefined,
    games: [],
    leaderboard: null
  };

  function init(sio) {
    g.io = sio;
    
    g.leaderboard = new Leaderboard('leaders', {pageSize: 10}, {db: DBINDEX});
    var client = redis.createClient();
    client.select(DBINDEX);
    
    bindSocketEvents();
    return g;
  };

  function bindSocketEvents() {
    g.io.sockets.on('connection', function onConnection(socket) {
      util.log("Client has connected: " + socket.id);
      
      g.leaderboard.list(function(err, list) {
        socket.emit('connected', { 
          id: socket.id,
          leaderboard: list
        });
      });

      var game = new GameController({ id: socket.id });
      g.games.push(game);
      
      //socket.on('postScore', onPostScore);
      socket.on('buyStock', onBuyStock);
      socket.on('sellStock', onSellStock);
      socket.on('startInvest', onStartInvest);
      socket.on('setPlayerName', onSetPlayerName)
      
      socket.on('startHunt', onStartHunt);
      socket.on('testWord', onTestWord);
      
      socket.on('postScore', onPostScore);
    });
  };
  
  function onStartInvest() {
    // TODO: Move to InvestPhase
    var TIME_MS = 3.0e4;
    var TIME_INTERVAL_MS = 100.0;
    var numPoints = TIME_MS / TIME_INTERVAL_MS;
    var self = this;
    
    var game = gameById(this.id);
    
    /* istanbul ignore if */
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    game.setPhase('invest');
    var InvestPhase = game.getPhase();
    InvestPhase.startInvest();
    self.emit('begin', {price: InvestPhase.getStockPrice()});
    
    var addNewPointsInterval = setInterval(
      function () {
        InvestPhase.addPoint();
        self.emit('addNewPoint', {price: InvestPhase.getStockPrice()});
      },
      TIME_INTERVAL_MS
    );
    
    setTimeout(
      function() { 
        clearInterval(addNewPointsInterval);
        game.setWallet(InvestPhase.endInvest());
        self.emit('endInvest', {wallet: game.getWallet()});
      }, 
      TIME_MS + 200.0
    );
  };
  
  function onBuyStock() {
    var game = gameById(this.id);
    /* istanbul ignore if  */ 
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    var InvestPhase = game.getPhase();
    
    if(game.getPhaseName() != 'invest') return;
    
    var success = InvestPhase.buyStock();
    if(success) {
      game.setScore(game.getScore() + 1);
    }
    
    this.emit('buyStock', {
      success: success,
      wallet: game.setWallet(InvestPhase.getWallet()),
      stockCount: InvestPhase.getStockCount(),
      score: game.getScore()
    });
  };
  
  function onSellStock() {
    var game = gameById(this.id);
    /* istanbul ignore if  */  
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    if(game.getPhaseName() != 'invest') return;
    
    var InvestPhase = game.getPhase();
    
    var success = InvestPhase.sellStock();
    if(success) {
      game.setScore(game.getScore() + 1);
    }
    this.emit('sellStock', {
      success: success,
      wallet: game.setWallet(InvestPhase.getWallet()),
      stockCount: InvestPhase.getStockCount(),
      score: game.getScore()
    });
  };
  
  function onStartHunt() { 
    console.log('onStartHunt');
    
    var self = this;
    
    var game = gameById(this.id);
    
    /* istanbul ignore if  */ 
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    var TIME_INTERVAL_MS = 5.0e3 - (game.getLevel() * 2.0e2);
    
    game.setPhase('hunt');
    var HuntPhase = game.getPhase();
    HuntPhase.startHunt();
    
    self.emit('begin', {
      word: HuntPhase.getWord(),
      opportunityToNext: HuntPhase.getOpportunityToNext()
    });
    
    var counter = 0;
    
    var addNewPointsInterval = setInterval(
      function (HuntPhase) {
        if(HuntPhase.isDead() || game.getWallet() <= 0 ) {
          self.emit('dead');
          clearInterval(addNewPointsInterval);
          return;
        }
        if(HuntPhase.isAdvance()) {
          clearInterval(addNewPointsInterval);
          return;
        }
        HuntPhase.newWord();
        resp = {
          word: HuntPhase.getWord(), 
          timer: TIME_INTERVAL_MS,
          wallet: game.setWallet(game.getWallet() - game.getLevel() * 1.0e2)
        };
        self.emit('newWord', resp);
        counter++;
      },
      TIME_INTERVAL_MS,
      HuntPhase
    ); 
  };
  
  function onTestWord(resp) { 
    console.log('onTestWord');
    
    var game = gameById(this.id);
    
    /* istanbul ignore if  */  
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    if(game.getPhaseName() != 'hunt') return;
    
    var HuntPhase = game.getPhase();
    // TODO: see if correct phase
    
    if(!HuntPhase.isCorrect(resp)) {
      this.emit('incorrect', {wallet: game.setWallet(HuntPhase.getWallet())});
    }
    
    else {
      game.setScore(game.getScore() +  HuntPhase.getWord().score);
      this.emit('correct', {
        score: game.getScore(),
        gain: HuntPhase.getWord().score
      });
    }
    if(HuntPhase.isDead()){
        this.emit('dead');
        game.die();
    }
    if(HuntPhase.isAdvance()) {
      this.emit('advance');
      game.setPhase('');
      game.level++;
      
    }
  };
  
  function onPostScore(data) {
    console.log("test");
        
    var game = gameById(this.id);
    
    /* istanbul ignore if  */  
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    var toPost = game.getDataToPost();
    console.log(toPost);
    if (toPost) {
      g.leaderboard.add(data.name, toPost.score);
    }
  };
  
  function onSetPlayerName(data) {
    var game = gameById(this.id);
    /* istanbul ignore if  */ 
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    game.setName(data);
    
    this.emit('playerDetails', {
      name: game.getName(),
      id: this.id
    });
  };
  
  function gameById(id) {
    for (var i = 0; i < g.games.length; i++) {
      if (g.games[i].getId() === id) {
        return g.games[i];
      }
    }
    return false;
  };

  init(io);

});