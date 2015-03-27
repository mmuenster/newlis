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
    firebaseUtils.getUser().then(function(data){
      $scope.user = data;
    });
    $scope.awesomeThings = [1,2,33]
    $scope.logout = firebaseUtils.logout;

    $scope.search = function(q) {
      $state.go('home.caseEdit', {caseNum:q})
      $scope.searchText = "";
    }

    $scope.isAdmin = function() {
      if(user.profile.roles) { 
        return (user.profile.roles.indexOf('Admin') > -1) ? true : false;
      } else {
     	return false
      }
    }
  });
