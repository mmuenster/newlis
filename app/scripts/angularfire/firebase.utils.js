
// a simple wrapper on Firebase and AngularFire to simplify deps and keep things DRY
angular.module('firebase.utils', ['firebase', 'firebase.config'])
  .service('firebaseUtils', ['FBURL', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$q',
    function(FBURL, $firebaseObject, $firebaseArray, $firebaseAuth, $q) {
      'use strict';
      var fns={};
      var FBREF = new Firebase(FBURL);
      var auth = $firebaseAuth(FBREF);
      var FBCurrentUserRef = auth.$getAuth() ? new Firebase(FBURL + 'users/' + auth.$getAuth().uid) : {};

      var listeners = [];
      auth.$onAuth(statusChange);

      function statusChange() {
          fns.initialized = true;
          fns.user = auth.$getAuth() || null;
          angular.forEach(listeners, function(fn) {
            fn(fns.user);
          });
      }

      function getFirebaseRef(path) {
          return new Firebase(FBURL + path);
      }

      this.isAuth = function() {
        return auth.$getAuth();
      };

      this.watch=function(cb, $scope) {
          auth.$waitForAuth().then(function(user) {
            cb(user);
          });
          listeners.push(cb);
          var unbind = function() {
            var i = listeners.indexOf(cb);
            if( i > -1 ) { listeners.splice(i, 1); }
          };
          if( $scope ) {
            $scope.$on('$destroy', unbind);
          }
          return unbind;
      };

      this.logout=function() {
        auth.$unauth();
      };

      this.syncObject = function(path) {
        var fbRef = new Firebase(FBURL + path)
        return $firebaseObject(fbRef)
      };

      this.syncArray = function(path) {
        var fbRef = new Firebase(FBURL + path)
        return $firebaseArray(fbRef)
      };

      this.getUser = function() {
        var user = $firebaseAuth(FBREF).$getAuth();
        if(user) {
          var deferred = $q.defer()
          var profile = $firebaseObject(FBCurrentUserRef).$loaded();
          profile.then(function(data) {
            user.profile=data;
            deferred.resolve(user);
          }, function(error) {
            deferred.reject("Profile Rejected!",error);
          });
          return deferred.promise;
        } else {
          return user;
        }
      };

      this.passwordLogin = function(creds, opts) {
          return auth.$authWithPassword(creds, opts);
      };

      this.createAccount = function(email, pass, opts) {
          return auth.$createUser({email: email, password: pass})
            .then(function() {
              // authenticate so we have permission to write to Firebase
              return fns.passwordLogin({email: email, password: pass}, opts);
            })
            .then(function(user) {
              // store user data in Firebase after creating account
              return createProfile(user.uid, email/*, name*/).then(function() {
                return user;
              });
            });
        };

        this.changePassword = function (email, oldpass, newpass) {
          return auth.$changePassword({email: email, oldPassword: oldpass, newPassword: newpass});
        };

        this.changeEmail = function(password, newEmail, oldEmail) {
          return auth.$changeEmail({password: password, oldEmail: oldEmail, newEmail: newEmail});
        };

        this.removeUser = function(email, pass, uid) {
          var userRef = getFirebaseRef('users/' + uid)
          console.log(userRef)
          userRef.remove(function(error) {
            if(error) {
              console.log("Error:",error)
            } else {
              return auth.$removeUser({email: email, password: pass});
            }
          });
        };

      }]);
    // return {
    //   syncObject: function(path, factoryConfig) { // jshint ignore:line
    //     return syncData.apply(null, arguments).$asObject();
    //   },

    //   syncArray: function(path, factoryConfig) { // jshint ignore:line
    //     return syncData.apply(null, arguments).$asArray();
    //   },

    //   ref: firebaseRef
    // };

    // function pathRef(args) {
    //   for (var i = 0; i < args.length; i++) {
    //     if (angular.isArray(args[i])) {
    //       args[i] = pathRef(args[i]);
    //     }
    //     else if( typeof args[i] !== 'string' ) {
    //       throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
    //     }
    //   }
    //   return args.join('/');
    // }

    // /**
    //  * Example:
    //  * <code>
    //  *    function(firebaseRef) {
    //      *       var ref = firebaseRef('path/to/data');
    //      *    }
    //  * </code>
    //  *
    //  * @function
    //  * @name firebaseRef
    //  * @param {String|Array...} path relative path to the root folder in Firebase instance
    //  * @return a Firebase instance
    //  */
    // function firebaseRef(path) { // jshint ignore:line
    //   var ref = new $window.Firebase(FBURL);
    //   var args = Array.prototype.slice.call(arguments);
    //   if( args.length ) {
    //     ref = ref.child(pathRef(args));
    //   }
    //   return ref;
    // }

    // /**
    //  * Create a $firebase reference with just a relative path. For example:
    //  *
    //  * <code>
    //  * function(syncData) {
    //      *    // a regular $firebase ref
    //      *    $scope.widget = syncData('widgets/alpha');
    //      *
    //      *    // or automatic 3-way binding
    //      *    syncData('widgets/alpha').$bind($scope, 'widget');
    //      * }
    //  * </code>
    //  *
    //  * Props is the second param passed into $firebase. It can also contain limit, startAt, endAt,
    //  * and they will be applied to the ref before passing into $firebase
    //  *
    //  * @function
    //  * @name syncData
    //  * @param {String|Array...} path relative path to the root folder in Firebase instance
    //  * @param {object} [props]
    //  * @return a Firebase instance
    //  */
    // function syncData(path, props) {
    //   var ref = firebaseRef(path);
    //   props = angular.extend({}, props);
    //   angular.forEach(['limitToFirst', 'limitToLast', 'orderByKey', 'orderByChild', 'orderByPriority', 'startAt', 'endAt'], function(k) {
    //     if( props.hasOwnProperty(k) ) {
    //       var v = props[k];
    //       ref = ref[k].apply(ref, angular.isArray(v)? v : [v]);
    //       delete props[k];
    //     }
    //   });
    //   return $firebase(ref, props);
    // }

