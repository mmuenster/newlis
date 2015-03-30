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

    $scope.setModalData = function(key,value) {
      $scope.modalData = value;
      $scope.modalData.uid = key;
    }

    $scope.removeUser=  function(user) {
      firebaseUtils.removeUser(user.email,user.password,user.uid)
        .then(
          function(message) { success(user.name + " deleted sucessfully!")},
          function(message) { error(message)}
        );
    };   

    $scope.data = firebaseUtils.syncObject('users/' + "simplelogin:56" );

    $scope.saveUser = function() {
      $scope.data.$save();
    }

    $scope.addNewUser = function() {
      firebaseUtils.createNewUser(
        { email:$scope.addNew.email, 
          password:$scope.addNew.password, 
          name:$scope.addNew.name, 
          roles:$scope.addNew.roles})
      .then(
        function(message) {success(message)}, 
        function(message) {error(message)}
      );
    }


    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        simpleLogin.changePassword($scope.data.email, oldPass, newPass)
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      simpleLogin.changeEmail(pass, newEmail, $scope.data.email)
        .then(function() {
          $scope.data.email = newEmail;
          $scope.data.$save();
          success('Email changed');
        })
        .catch(error);
    };

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

  });
