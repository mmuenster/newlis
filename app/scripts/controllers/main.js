'use strict';

/**
 * @ngdoc function
 * @name newlisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newlisApp
 */
angular.module('newlisApp')
  .controller('MainCtrl', function ($scope, user, profile, simpleLogin, $state) {
  	$scope.profile = profile;
  	$scope.user = user;
    $scope.awesomeThings = [1,2,33]
    $scope.logout = simpleLogin.logout;

    $scope.search = function(q) {
      $state.go('home.caseEdit', {caseNum:q})
      $scope.searchText = "";
    }

    $scope.isAdmin = function() {
      if(profile.roles) { 
        return (profile.roles.search("Admin") > 0) ? true : false;
      } else {
     	return false
      }
    }
  });
