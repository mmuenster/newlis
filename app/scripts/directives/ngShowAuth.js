/**
 * @ngdoc function
 * @name newlisApp.directive:ngShowAuth
 * @description
 * # ngShowAuthDirective
 * A directive that shows elements only when user is logged in. It also waits for firebaseUtils
 * to be initialized so there is no initial flashing of incorrect state.
 */
angular.module('newlisApp')
  .directive('ngShowAuth', ['firebaseUtils', '$timeout', function (firebaseUtils, $timeout) {
    'use strict';
    var isLoggedIn;
    firebaseUtils.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        firebaseUtils.watch(update, scope);
      }
    };
  }]);
