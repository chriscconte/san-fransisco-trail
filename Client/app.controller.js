/*global $*/
/*global angular*/
/*global Highcharts*/

(function () {
  'use strict';
  
  angular.module('myApp')
    .controller('myCtrl', function ($scope, $interval, socket) {
      var ctrl = this;
    
      socket.on('connected', function(data) {
        ctrl.id = data.id;
      })
    
      ctrl.player = {
        name: "Player",
        score: 0,
        wallet: 5000.0,
        level: 1,
        mode: 0,
        isAlive: true
      };
    
      ctrl.play = function () {
        ctrl.player.mode = 1;
      };
    
      // TODO
      ctrl.playHuntLevel = function () { };
      ctrl.postScore = function () { };
    });
}());