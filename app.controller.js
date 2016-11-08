/*global $*/
/*global angular*/
/*global Highcharts*/

(function () {
  'use strict';
  
  angular.module('myApp')
    .controller('myCtrl', function ($scope, $interval) {
      var ctrl = this;
    
      ctrl.player = {
        name: "Player",
        score: 0,
        wallet: 5000.0,
        level: 1
      };
      ctrl.mode = 0;
      ctrl.isAlive = true;
    
      ctrl.play = function () { 
        this.mode = 1;
      };
    
      // TODO
      ctrl.playHuntLevel = function () { };
      ctrl.postScore = function () { };
    });
}());