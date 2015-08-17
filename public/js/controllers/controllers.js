
app.controller('loginctrl', function($scope, $rootScope, $http, $location) {
  $scope.user = {};
  $rootScope.title = 'Front End developer test Login';

  $scope.login = function(){
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      $location.url('/states');
    })
    .error(function(){
      $location.url('/login');
    });
  };
});

app.controller('statesCtrl', function($scope, $rootScope, $http) {

  $scope.states = [];
  //$scope.selectedOption = null;
  $rootScope.title = 'Technicolor All States';

  $http.get('/states').success(function(states){
    for (var i in states){
        $scope.states.push(states[i]);
    }
    $scope.selectedOption = states[0].abbreviation;
    selectedState_done($scope.selectedOption);
  });

  function selectedState_done(abbrev){
    $http.get('/states/'+abbrev).success(function(data){
       $scope.abbreviation = data.abbreviation;
       $scope.capital = data.capital;
       $scope.mostPopulousCity = data['most-populous-city'];
       $scope.population = data.population;
       $scope.squareMiles = data['square-miles'];
       $scope.timezoneOne = data['time-zone-1'];
       $scope.timezoneTwo = data['time-zone-2'];
    });
  }
  $scope.selectedState = function(index){
    selectedState_done(index);
  };
});

app.controller('msgsCtrl', function($scope, $rootScope, $http){
    $rootScope.title = 'Technicolor Guest book details';
    $scope.msgs = [];
    $scope.guestSubmit = function(data){
      $scope.msgs.push({user: (document.cookie.match(/^(?:.*;)?login=([^;]+)(?:.*)?$/)||[,null])[1], phone: $scope.msg.phone, message: $scope.msg.message});
    };

});