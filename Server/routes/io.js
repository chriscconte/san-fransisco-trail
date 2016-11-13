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

      var GameController = new GameController({ id: socket.id });
      g.games.push(GameController);
      
      //socket.on('postScore', onPostScore);
      socket.on('buyStock', onBuyStock);
      socket.on('sellStock', onSellStock);
      socket.on('startInvest', onStartInvest);
      
    });
  };
  
  function onStartInvest(data) {
    
    var TIME_MS = 3.0e4;
    var TIME_INTERVAL_MS = 100.0;
    var numPoints = TIME_MS / TIME_INTERVAL_MS;
    
    var game = gameById(this.id);

    if (!game) {
      util.log("game not found: " + this.id);
      return;
    }
    game.phase.startInvest();
    setInterval(
      function () {
        game.phase.addPoint();
        this.emit('newDataPoint', {price: game.phase.stockPrice});
      },
      TIME_INTERVAL_MS,
      numPoints - 1
    );
    timeout(
      function() { 
        game.phase.endInvest();
        this.emit('endInvest');
      }, 
      TIME_MS + 200.0
    );
  };
  
  function onBuyStock(data) {
    var game = gameById(this.id);
    var sucess = game.phase.buyStock();
    this.emit('buyStock', {success: sucess});
  };
  
  function onSellStock(data) {
    var game = gameById(this.id);
    var sucess = game.phase.sellStock();
    this.emit('sellStock', {success: sucess});
  };

  function onSetPlayerName(data) {
    console.log('onSetPlayerName', data);
    // Send details to player
    this.emit('playerDetails', {
      id: this.id
    });
  };

  init(io);

});