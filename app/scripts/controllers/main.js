'use strict';

/**
 * @ngdoc function
 * @name newlisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newlisApp
 */
angular.module('newlisApp')
  .controller('MainCtrl', function ($scope, user, profile, simpleLogin) {
  	$scope.profile = profile;
  	$scope.user = user;
    $scope.awesomeThings = [1,2,33]
    $scope.logout = simpleLogin.logout;

    $scope.isAdmin = function() {
      if(profile.roles) { 
        return (profile.roles.search("Admin") > 0) ? true : false;
      } else {
     	return false
      }
    }
  });
