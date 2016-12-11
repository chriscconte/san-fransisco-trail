var should = require('should');
var io = require('socket.io-client'),
    server = require('../index.js');
var assert = require('assert');
var async = require('async');
var redis = require('redis');
var LB = require('leaderboard');

var socketURL = 'http://localhost:8000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var player1 = {'name':'Tom'};
var player2 = {'name':'Sally'};
var player3 = {'name':'Dana'};

// Constants
var DBINDEX = 15;
var PAGESIZE = 5;

// Before all suites
before(function(done) {
  // Initialize a subject leaderboard before all suites
  this.board = new LB('general', {pageSize: PAGESIZE}, {db: DBINDEX});

  // Creating connection to the redis and 
  // changing the current selected database
  this.client = redis.createClient();
  this.client.select(DBINDEX, done);
});

  
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
  
  /* User sets name. */
  it('Should be able to set player name', function(done){
     var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('setPlayerName', {name: 'john'});
    });

    client.on('playerDetails',function(data){
      
      data.name.should.equal('john');
      client.disconnect();
      done(); 
      })
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
        
        /* If this client doesn't disconnect it will interfere 
        with the next test */
        client.disconnect();
        data.success.should.equal(false);
        done(); 
      })
    });
  });
  
  it('Should be able to sell stock they bought', function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startInvest', player1);
      client.emit('buyStock');
    });

    client.on('addNewPoint',function(data){
      client.emit('sellStock');
      
      client.on('sellStock', function(data){
        
        /* If this client doesn't disconnect it will interfere 
        with the next test */
        client.disconnect();
        data.success.should.equal(true);
        done(); 
      })
    });
  });
  
  /* Test 4: start hunt */
  
  it('Should begin to receive words after start hunt', function(done){
     var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startHunt', player1);
    });

    client.on('begin', function(data){
      done(); 
    });
  });
  
  
  /*
  incorrect word
  */
  it('Should to receive an incorrect after guessing wrong', function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startHunt', player1);
    });
  
    client.on('begin',function(data){
      client.emit('testWord', {guess: ''});
    });
        
    client.on('incorrect', function(resp) {
       done(); 
    });
    
  });
  
  /*
  change phase
  */
  it('Should to receive an correct after guessing right', function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('startHunt', player1);
    });
  
    client.on('begin',function(data){
      client.emit('testWord', {guess: data.word.word});
    });
        
    client.on('correct', function(resp) {
       done(); 
    });
    
  });
  
  // leaderboard
  it('Should be able to fetch the leaderboard', function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      if(data.leaderboard) {
        done();
      }
    });
  });
  
  // try to post when not dead
  it('Should be able to fetch the leaderboard', function(done){
    var client = io.connect(socketURL, options);

    client.on('connected',function(data){
      client.emit('postScore');
      done();
    });
  });
  
});