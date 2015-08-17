'use strict';

var app = angular.module('technicolor', ['ngResource', 'ngRoute'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html'
      })
      .when('/states', {
        templateUrl: 'views/states.html'
      })
      .when('/guest', {
        templateUrl: 'views/guestbook.html'
      })
      .otherwise({
        redirectTo: '/'
    });

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/');
          return $q.reject(response);
        }
      };
    });

  }).run(function($rootScope, $http, $location){
  /*
	$rootScope.$on('$locationChangeStart', function(event){
		//console.log(document.cookie.valueOf("login"));
		if(document.cookie.indexOf('login') !== -1){
			return true;
		}else{
			$location.path('/');
		}	
	});
*/
	$rootScope.logout = function(){
      $rootScope.alert = 'Logged out.';
      $http.get('/logout');
    };
	
  });