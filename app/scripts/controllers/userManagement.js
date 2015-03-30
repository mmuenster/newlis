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

    $scope.users = firebaseUtils.syncArray('/users');

    $scope.messages = [];

    $scope.setModalData = function(user) {
      $scope.modalData = angular.copy(user);
      $scope.newpass = "";
      $scope.confirm = "";
      $scope.newEmail = "";
    }

    $scope.removeUser=  function(user) {
      firebaseUtils.removeUser(user.email,user.password,user.$id)
        .then(
          function(message) { success(user.name + " deleted sucessfully!")},
          function(message) { error(message)}
        );
    };   

    $scope.saveUser = function() {
      var x = $scope.users.$indexFor($scope.modalData.$id);
      $scope.users[x]=$scope.modalData;
      $scope.users.$save(x).then(
        function(message) { success ("Changes to user " + $scope.users[x].name + " saved sucessfully.") },
        function(error) { error (message) }
        );
    }

    $scope.changePassword = function() {
      $scope.err = null;
      if( !$scope.confirm || !$scope.newpass ) {
        error('Please enter all fields');
      }
      else if( $scope.newpass !== $scope.confirm ) {
        error('Passwords do not match');
      }
      else {
        firebaseUtils.changePassword($scope.modalData.email, $scope.modalData.password, $scope.newpass)
          .then(
            function() { 
              var x = $scope.users.$indexFor($scope.modalData.$id);
              $scope.users[x].password = $scope.newpass;
              $scope.users.$save(x).then(
                function(message) { success ("Password for user " + $scope.users[x].name + " changed sucessfully.") },
                function(message) { error(message) }
                )},
            function(message) { error(message) }
          );
      }
    };

    $scope.changeEmail = function() {
      $scope.err = null;
      firebaseUtils.changeEmail($scope.modalData.password, $scope.newEmail, $scope.modalData.email)
        .then(
          function() { 
            var x = $scope.users.$indexFor($scope.modalData.$id);
            $scope.users[x].email = $scope.newEmail;
            $scope.users.$save(x).then(
              function(message) { success ("Email for user " + $scope.users[x].name + " changed sucessfully.") },
              function(message) { error(message) }
              )},
          function(message) { error(message) }
        );
    };


    $scope.addNewUser = function() {
      firebaseUtils.createNewUser(
        { email:$scope.addNew.email, 
          password:$scope.addNew.password, 
          name:$scope.addNew.name, 
          roles:$scope.addNew.roles})
      .then(
        function(message) {success("User " + $scope.addNew.name + " created sucessfully!")}, 
        function(message) {error(message)}
      );
    }



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
