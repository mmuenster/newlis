'use strict';
/**
 * @ngdoc overview
 * @name newlisApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['simpleLogin', function(simpleLogin) {
 *       return simpleLogin.getUser();
 *     }]
 *   }
 *
 */
angular.module('newlisApp')

// /**
//  * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
//  * when called, invokes the authRequired() service (see simpleLogin.js).
//  *
//  * The promise either resolves to the authenticated user object and makes it available to
//  * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
//  * forcing a redirect to the /login page
//  */
//   .config(['$routeProvider', 'SECURED_ROUTES', function($routeProvider, SECURED_ROUTES) {
//     // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
//     // unfortunately, a decorator cannot be use here because they are not applied until after
//     // the .config calls resolve, so they can't be used during route configuration, so we have
//     // to hack it directly onto the $routeProvider object
//     $routeProvider.whenAuthenticated = function(path, route) {
//       route.resolve = route.resolve || {};
//       route.resolve.user = ['authRequired', function(authRequired) {
//         return authRequired();
//       }];
//       $routeProvider.when(path, route);
//       SECURED_ROUTES[path] = true;
//       return $routeProvider;
//     };
//   }])

   //ui-router configuration of states
.config(function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  var getUser = ['firebaseUtils', function(firebaseUtils) {
    var userPromise = firebaseUtils.getUser().then(function(result) {
      return result;
    })
    return userPromise;
  }];

  $stateProvider
    .state('home.chat', {
      templateUrl: 'views/chat.html',
      controller: 'ChatCtrl',
      url: 'chat'
    })
    .state('home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      url: '/',
      resolve: {
        user: getUser,
      }
    })
    .state('home.userManagement', {
      templateUrl: 'views/userManagement.html',
      controller: 'UserManagementController',
      url: 'userManagement',
    })
    .state('home.caseEdit', {
      templateUrl: 'views/caseEdit.html',
      controller: 'CaseeditCtrl',
      url: 'caseEdit/:caseNum'
    })    
    .state('login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      url: '/login'
    })
})
  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * { authRequired: true } to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
  .run(['$state','$rootScope', 'firebaseUtils', 'loginRedirectState',
    function($state, $rootScope, firebaseUtils, loginRedirectState) {
      
      // watch for login status changes and redirect if appropriate
      firebaseUtils.watch(check, $rootScope);

      // // some of our routes may reject resolve promises with the special {authRequired: true} error
      // // this redirects to the login page whenever that is encountered
      // $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
      //   if( angular.isObject(err) && err.authRequired ) {
      //     $location.path(loginRedirectPath);
      //   }
      // });

      $rootScope.$on('$stateChangeError', function(e, next, prev, err) {
          console.log("$stateChangeError")
          $state.go(loginRedirectState);
        });

      function check(user) {
        if(!user) {
            $state.go(loginRedirectState);
        }
      }

    }
  ]);
