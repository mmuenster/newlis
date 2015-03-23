'use strict';

/**
 * @ngdoc overview
 * @name newlisApp
 * @description
 * # newlisApp
 *
 * Main module of the application.
 */
angular.module('newlisApp', [
    'ngRoute',
    'firebase',
    'firebase.utils',
    'simpleLogin'
  ]);

angular.module('newlisApp')
  .controller('IndexController', function ($scope, $rootScope, simpleLogin, fbutil, $timeout) {
    
    $rootScope.profile = { roles:"" };

    $scope.logout = simpleLogin.logout;

    $scope.isAdmin = function() {
      if(!$rootScope.profile.roles) { 
        return false;
     } else {
        return ($rootScope.profile.roles.search("Admin") > 0) ? true : false;
      }
    }

    $rootScope.$on('$locationChangeStart', function() {
      var user = (simpleLogin.getUser() === null) ? {uid:""} : simpleLogin.getUser();
      var profile = fbutil.syncObject('users/'+user.uid);
      profile.$loaded().then(function() {
        $rootScope.profile = profile;
      })
    })
  });
