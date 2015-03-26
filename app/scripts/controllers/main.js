'use strict';

/**
 * @ngdoc function
 * @name newlisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newlisApp
 */
angular.module('newlisApp')
  .controller('MainCtrl', function ($scope, user, firebaseUtils, $state) {
    $scope.user = user;
    $scope.awesomeThings = [1,2,33]
    $scope.logout = firebaseUtils.logout;

    $scope.search = function(q) {
      $state.go('home.caseEdit', {caseNum:q})
      $scope.searchText = "";
    }

    $scope.isAdmin = function() {
      if(user.profile.roles) { 
        return (user.profile.roles.search("Admin") > 0) ? true : false;
      } else {
     	return false
      }
    }
  });
