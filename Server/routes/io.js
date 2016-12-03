module.exports = 
(function(app, io) {
  var util = require('util');
  var GameController = require('./../models/GameController');
  
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
      
      async.parallel([
          function(cb) { g.leaderboard.add('member1', 10, cb); },
          function(cb) { g.leaderboard.add('member2', 20, cb); }
        ], function(err, results) {
        util.log(results);
        g.leaderboard.list(function(err, list) {
          util.log(list);
          socket.emit('connected', { 
            id: socket.id,
            leaderboard: list
          });
        })
      });

      var game = new GameController({ id: socket.id });
      g.games.push(game);
      
      //socket.on('postScore', onPostScore);
      socket.on('buyStock', onBuyStock);
      socket.on('sellStock', onSellStock);
      socket.on('startInvest', onStartInvest);
      
      socket.on('startHunt', onStartHunt);
      socket.on('testWord', onTestWord);
      
      socket.on('postScore', onPostScore);
      socket.on('getLeaderboard', onGetLeaderboard);
    });
  };

  
  function onStartInvest() {
    // TODO: Move to InvestPhase
    var TIME_MS = 3.0e3;
    var TIME_INTERVAL_MS = 100.0;
    var numPoints = TIME_MS / TIME_INTERVAL_MS;
    var self = this;
    
    var game = gameById(this.id);
    
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
        game.wallet = InvestPhase.endInvest();
        
        self.emit('endInvest', {wallet: game.wallet});
      }, 
      TIME_MS + 200.0
    );
  };
  
  function onBuyStock() {
    var game = gameById(this.id);
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    var InvestPhase = game.getPhase();
    
    this.emit('buyStock', {
      success: InvestPhase.buyStock(),
      wallet: game.setWallet(InvestPhase.getWallet()),
      stockCount: InvestPhase.getStockCount(),
      score: game.setScore(InvestPhase.getScore())
    });
  };
  
  function onSellStock() {
    var game = gameById(this.id);
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    var InvestPhase = game.getPhase();
    var success = InvestPhase.sellStock();
    console.log(game.score);
    this.emit('sellStock', {
      success: success,
      wallet: game.setWallet(InvestPhase.getWallet()),
      stockCount: InvestPhase.getStockCount(),
      score: game.setScore(InvestPhase.getScore())
    });
  };
  
  function onStartHunt() { 
    console.log('onStartHunt');
    
    var self = this;
    
    var TIME_MS = 3.0e4;
    var TIME_INTERVAL_MS = 5.0e3;
    
    var game = gameById(this.id);
    
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    game.setPhase('hunt');
    var HuntPhase = game.getPhase();
    HuntPhase.startHunt();
    self.emit('begin', {
      words: HuntPhase.getWord(),
      opportunityToNext: HuntPhase.getOpportunityToNext()
    });
    
    var addNewPointsInterval = setInterval(
      function (HuntPhase) {
        if(HuntPhase.isDead() || HuntPhase.isAdvance()) {
          clearInterval(addNewPointsInterval);
          return;
        }
        HuntPhase.newWord();
        resp = {
          word: HuntPhase.getWord(), 
          timer: TIME_INTERVAL_MS
        };
        self.emit('newWord', resp);
      },
      TIME_INTERVAL_MS,
      HuntPhase
    ); 
  };
  
  function onTestWord(resp) { 
    console.log('onTestWord');
    
    var game = gameById(this.id);
    
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    var HuntPhase = game.getPhase();
    // TODO: see if correct phase
    
    if(!HuntPhase.isCorrect(resp)) {
      this.emit('incorrect', {wallet: game.setWallet(HuntPhase.getWallet())});
    }
    else {
      this.emit('correct', {score: HuntPhase.getWord().score})
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
  
  function onPostScore() {
    console.log("test");
        
    var game = gameById(this.id);
    
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    var toPost = game.getDataToPost();
    console.log(toPost);
    if (toPost) {
      g.leaderboard.add(toPost.name, toPost.score);
    }
  }
  
  function onGetLeaderboard(resp) {
    g.leaderboard.list(resp.page, function(err, list) {
      if(err) {
        return;
      }
      socket.emit('leaderboard', {list: list});
    });
  }
  
  function onSetPlayerName(data) {
    console.log('onSetPlayerName', data);
    
    var game = gameById(this.id);
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    game.setName(data);
    
    this.emit('playerDetails', {
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