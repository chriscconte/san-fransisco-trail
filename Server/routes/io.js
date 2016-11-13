module.exports = 
(function(app, io) {
  var util = require('util');
  var GameController = require('./../models/GameController');

  g = {
    io: undefined,
    games: []
  };

  function init(sio) {
    g.io = sio;
    bindSocketEvents();

    return g;
  };

  function bindSocketEvents() {
    g.io.sockets.on('connection', function onConnection(socket) {
      util.log("Client has connected: " + socket.id);

      socket.emit('connected', { id: socket.id });

      var game = new GameController({ id: socket.id });
      g.games.push(game);
      
      //socket.on('postScore', onPostScore);
      socket.on('buyStock', onBuyStock);
      socket.on('sellStock', onSellStock);
      socket.on('startInvest', onStartInvest);
      
    });
  };
  
  // todo pass in level data
  function onStartInvest() {
    var TIME_MS = 3.0e4;
    var TIME_INTERVAL_MS = 100.0;
    var numPoints = TIME_MS / TIME_INTERVAL_MS;
    var self = this;
    
    var game = gameById(this.id);
    
    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    
    game.setPhase({ text:'invest' });
    var InvestPhase = game.getPhase();
    InvestPhase.startInvest();
    
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
        InvestPhase.endInvest();
        self.emit('endInvest');
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
      stockCount: InvestPhase.getStockCount()
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
    this.emit('sellStock', {
      success: success,
      wallet: game.setWallet(InvestPhase.getWallet()),
      stockCount: InvestPhase.getStockCount()
    });
  };

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