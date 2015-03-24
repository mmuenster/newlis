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

    $scope.logout = simpleLogin.logout;

    $scope.isAdmin = function() {
      if(profile.roles) { 
        return false;
     } else {
        return (profile.roles.search("Admin") > 0) ? true : false;
      }
    }
  });
