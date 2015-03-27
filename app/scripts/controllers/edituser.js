'use strict';

/**
 * @ngdoc function
 * @name newlisApp.controller:EdituserCtrl
 * @description
 * # EdituserCtrl
 * Controller of the newlisApp
 */
angular.module('newlisApp')
  .controller('EdituserCtrl', function ($scope, $stateParams, firebaseUtils, $timeout) {
    $scope.data = firebaseUtils.syncObject('users/' + $stateParams.uid);

    $scope.saveUser = function() {
      $scope.data.$save();
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

    function loadProfile(user) {
      if( profile ) {
        profile.$destroy();
      }
      profile = fbutil.syncObject('users/'+user.uid);
      profile.$bindTo($scope, 'profile');
    }
  });
