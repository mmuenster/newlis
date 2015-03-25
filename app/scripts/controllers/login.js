'use strict';
/**
 * @ngdoc function
 * @name newlisApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('newlisApp')
  .controller('LoginCtrl', function ($scope, simpleLogin, fbutil, $state) {
    
    if(simpleLogin.getUser()) {
      redirect();
    }

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin({email: email, password: pass}, {rememberMe: true}).then(
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
        simpleLogin.createAccount(email, pass, {rememberMe: true})
          .then(redirect, showError);
      }
    };
    

    function redirect() {
      $state.go('home');
    }

    function showError(err) {
      $scope.err = err;
    }

  });
