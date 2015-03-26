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
    
    if(user.profile.roles.search("Admin") < 0) {
      $state.go('uiHome')
    }

    $scope.users = firebaseUtils.syncObject('/users');

    $scope.messages = [];

    $scope.removeUser=  function(email,password,uid) {
      var r = confirm("Are you sure you want to delete the user, "+ user.profile.name + "?");
      if (r) {
          alert("You pressed OK!");
          //firebaseUtils.removeUser(email,password,uid);
      } 
    };    
  });
