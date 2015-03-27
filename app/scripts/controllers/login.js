'use strict';
/**
 * @ngdoc function
 * @name newlisApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('newlisApp')
  .controller('LoginCtrl', function ($scope, firebaseUtils, $state, $location) {
    
    if(firebaseUtils.isAuth()) {
      redirect();
    }

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      firebaseUtils.passwordLogin({email: email, password: pass}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        firebaseUtils.createAccount(email, pass, {rememberMe: true})
          .then(redirect, showError);
      }
    };
    
    function redirect() {
      $state.go('home'); 
    }

    function showError(err) {
      console.log(err)
      $scope.err = err;
    }

  });
