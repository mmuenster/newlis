'use strict';

/**
 * @ngdoc function
 * @name newlisApp.controller:AddnewuserCtrl
 * @description
 * # AddnewuserCtrl
 * Controller of the newlisApp
 */
angular.module('newlisApp')
  .controller('AddnewuserCtrl', function ($scope, firebaseUtils) {
  	
  	$scope.createNewUser = function(newUser) {
    	firebaseUtils.createNewUser({ email:$scope.email, password:$scope.password, name:$scope.name, roles:$scope.roles});
    }

  });
