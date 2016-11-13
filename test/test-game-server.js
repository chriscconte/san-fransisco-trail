var should = require('should');
var io = require('socket.io-client'),
    server = require('../index.js');

var socketURL = 'http://localhost:8000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var player1 = {'name':'Tom'};
var player2 = {'name':'Sally'};
var player3 = {'name':'Dana'};
  
describe("Game Server",function(){

  /* Test 1 - A Single User */
  it('Should instantiate a game when a new user connects',function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startInvest');
    });

    client.on('addNewPoint',function(data){
      data.should.be.type('object');
      data.should.have.property('price');
      /* If this client doesn't disconnect it will interfere 
      with the next test */
      client.disconnect();
      done(); 
    });
  });

  /* Test 2 - Multiple users */
  it('Should Handle multiple users', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connected', function(data){
      client1.emit('startInvest', player1);

      /* Since first client is connected, we connect
      the second client. */
      var client2 = io.connect(socketURL, options);

      client2.on('connected', function(data){
        client2.emit('startInvest', player2);
      });

      client2.on('addNewPoint', function(data){
        data.should.be.type('object');
        data.should.have.property('price');
        client2.disconnect();
        done();
      });

    });

    var numUsers = 0;
    client1.on('new user', function(usersName){
      numUsers += 1;

      if(numUsers === 2){
        usersName.should.equal(chatUser2.name + " has joined.");
        client1.disconnect();
        done();
      }
    });
  });

  /* Test 3 - User Buys Stock. */
  it('Should be able to buy stock', function(done){
     var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startInvest', player1);
    });

    client.on('addNewPoint',function(data){
      client.emit('buyStock');
      
      client.on('buyStock', function(data){
        data.success.should.equal(true);
        client.disconnect();
        done(); 
      })
    });
  });
    /* Test 4 - User Sells Stock. */
  it('Should be not be able to sell stock', function(done){
     var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startInvest', player1);
    });

    client.on('addNewPoint',function(data){
      client.emit('sellStock');
      
      client.on('sellStock', function(data){
        data.success.should.equal(false);
        done(); 
      })
    });
  });
  
});