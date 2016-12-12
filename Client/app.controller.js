/*global $*/
/*global angular*/
/*global Highcharts*/

(function () {
  'use strict';
  
  angular.module('myApp')
    .controller('myCtrl', function ($scope, $interval, socket) {
      var ctrl = $scope;
    
      ctrl.player = {
        name: "Player",
        score: 0,
        wallet: 5000.0,
        level: 1,
        mode: 0,
        isDead: false
      };
    
    
      ctrl.$watch('player.score', function(newValue, oldValue) {
        
        var scoreContainer = document.querySelector(".score-container");
        
        scoreContainer.innerHTML = 'Score: ' + String(newValue);
        
        var difference = newValue - oldValue; 
        
        if (difference > 0) {
          var addition = document.createElement("div");
          addition.classList.add("score-addition");
          addition.textContent = "+" + difference;
      
          scoreContainer.appendChild(addition);
        }
      });
    
    
    // todo
     ctrl.$watch('player.wallet', function(newValue, oldValue) {
        
        var scoreContainer = document.querySelector(".wallet-container");
        
        scoreContainer.innerHTML = 'Wallet: ' + String(newValue);
        
        var difference = newValue - oldValue; 
        
        if (difference > 0) {
          var addition = document.createElement("div");
          addition.classList.add("wallet-addition");
          addition.textContent = "+" + difference;
      
          scoreContainer.appendChild(addition);
        } else if(difference < 0) {
          var subtraction = document.createElement("div");
          subtraction.classList.add("wallet-subtraction");
          subtraction.textContent = difference;
      
          scoreContainer.appendChild(subtraction);
          
        }
      });
      
      ctrl.leaderboard = [];
    
      ctrl.play = function () {
        ctrl.player.mode = 1;
      };
      ctrl.getLeaderboard = function(page) {
        socket.emit('getLeaderboard', {page: page});
      }
      
      socket.on('connected', function(data) {
        ctrl.id = data.id;
        ctrl.leaderboard = ctrl.leaderboard.concat(data.leaderboard);
      });
    
      socket.on('leaderboard', function(data) {
        ctrl.leaderboard.concat(data.leaderboard);
      });
    
      ctrl.posted = false;
    
      ctrl.postScore = function () {
        socket.emit('postScore', {name: ctrl.player.name});
        ctrl.posted = true; 
      };
    });
}());