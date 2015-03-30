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

    $scope.cases = firebaseUtils.syncArray('/cases');

    $scope.orderBy = "receivedDate";
    $scope.reverse = false;
    $scope.orderString = "receivedDate";

    $scope.logout = firebaseUtils.logout;

    $scope.changeSortOrder = function(sortKey) {
      if(sortKey==$scope.orderBy) {
        $scope.reverse = !$scope.reverse
        if ($scope.reverse) {
          $scope.orderString = "-" + $scope.orderBy;
        } else {
          $scope.orderString = $scope.orderBy;
        }
      } else {
        $scope.orderBy = sortKey;
        $scope.reverse = false;
        $scope.orderString = $scope.orderBy;
      }
    }
    
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
