(function (angular) {
  'use strict';
  
  function HuntPartController($scope, $interval, $timeout) {
    
    var ctrl = this
    // TODO:
    
    this.beginHunt = function () {}
    this.fetchDictionary = function () {}
    
    this.finishHunt = function () {}
    
};

  angular.module('myApp').component('hunt', {
    templateUrl: 'hunt.html',
    controller: HuntPartController,
    bindings: {
      player: '='
    }
  });
  
})(window.angular);  
      