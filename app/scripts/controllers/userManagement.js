'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:UserManagementController
 * @description
 * # UserManagementController
 * Provides rudimentary account management functions.
 */
angular.module('newlisApp')
  .controller('UserManagementController', function ($scope, user, profile, $state, simpleLogin, fbutil, $timeout) {
    
    if(profile.roles.search("Admin") < 0) {
      $state.go('uiHome')
    }

    $scope.users = fbutil.syncObject('users');

    $scope.messages = [];


  });
