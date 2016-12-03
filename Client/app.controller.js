/*global $*/
/*global angular*/
/*global Highcharts*/

(function () {
  'use strict';
  
  angular.module('myApp')
    .controller('myCtrl', function ($scope, $interval, socket) {
      var ctrl = this;
    
      ctrl.player = {
        name: "Player",
        score: 0,
        wallet: 5000.0,
        level: 1,
        mode: 0,
        isDead: false
      };
    
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