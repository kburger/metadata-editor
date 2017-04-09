app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    })
    .when('/about', {
      templateUrl: 'about/about.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});