(function (angular) {
  'use strict';
  
  function HuntPartController($scope, $interval, $timeout, socket) {
    
    var ctrl = this
    $scope.guess = '';
    $scope.started = false;
    $scope.advance = false;
    $scope.dead = false;
    $scope.opportunityToNext = 0;
    $scope.opportunityGained = 0;
    $scope.wallet = ctrl.wallet;
    $scope.timer = 100;
    
    $scope.startHunt = function () {
      socket.emit('startHunt');
    };
    
    $scope.testWord = function() {
      socket.emit('testWord', {guess: $scope.guess});
      $scope.guess = '';
      $scope.currentWord = null;
    };
    $scope.advanceToInvest = function() {
      $scope.$ctrl.player.level++;
      $scope.$ctrl.player.mode = 1;
    };
    $scope.advanceToPost = function() {
      $scope.$ctrl.player.mode = 3;
    }
    
    socket.on('begin', function(resp){
      $scope.started = true;
      $scope.currentWord = resp.word;
      $scope.opportunityToNext = resp.opportunityToNext;
    });
    socket.on('newWord', function(resp){
      ctrl = this;
      /* ctrl.wordTimer = 100;
      $interval(function() {
        ctrl.wordTimer -= 1;
        $scope.timer = ctrl.wordTimer;
        
        if($scope.timer) {
          $scope.currentWord = null;
        }
      }, resp.timer / 100.0, 100);
      */
      
      $scope.currentWord = resp.word;
      $scope.$ctrl.player.wallet = resp.wallet;
    });
    socket.on('correct', function(resp) {
      $scope.$ctrl.player.score = resp.score;
      $scope.opportunityGained += resp.gain;
    });
    socket.on('incorrect', function(resp) {
      $scope.$ctrl.player.wallet = resp.wallet;
    });
    socket.on('advance', function(resp) {
      $scope.advance = true;
    });
    socket.on('dead', function(resp) {
      $scope.dead = true;
    })
};

  angular.module('myApp').component('hunt', {
    templateUrl: './hunt/hunt.html',
    controller: HuntPartController,
    bindings: {
      player: '='
    }
  });
  
})(window.angular);  
      