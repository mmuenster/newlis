'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:UserManagementController
 * @description
 * # UserManagementController
 * Provides rudimentary account management functions.
 */
angular.module('newlisApp')
  .controller('UserManagementController', function ($scope, user, $state, firebaseUtils, $timeout) {
    
    if(user.profile.roles.indexOf("Admin") < 0) {
      $state.go('uiHome')
    }

    $scope.users = firebaseUtils.syncObject('/users');

    $scope.messages = [];

    $scope.removeUser=  function(email,password,uid, name) {
      var r = confirm("Are you sure you want to delete the user, "+ name + "?");
      if (r) {
          firebaseUtils.removeUser(email,password,uid);
      } 
    };    
  });
