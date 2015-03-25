angular.module('newlisApp')
	.directive('autoFocus', function($timeout) {
	    return {
	        restrict: 'AC',
	        link: function(_scope, _element) {
	            $timeout(function(){
	            	console.log(_element[0])
	                _element[0].focus();
	            }, 10);
	        }
	    };
	});