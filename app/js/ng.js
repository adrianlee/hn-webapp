'use strict';

var webapp = angular.module('hn', []);

webapp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {});
    $routeProvider.when('/item/:itemId', {templateUrl: '/item.html', controller: 'ContentCtrl'});
    $routeProvider.when('/settings', {templateUrl: '/settings.html', controller: 'SettingsCtrl'});
    $routeProvider.when('/404', {templateUrl: '/404.html'});
    $routeProvider.otherwise({redirectTo: '/404'});
  }]);

webapp.config(['$locationProvider', function($location) {
    $location.html5Mode(true);
    $location.hashPrefix('!');
  }]);

webapp.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    // Collapse mobile navigation
    $(function () {
      // console.log(event)   
      if (next.templateUrl == "/item.html" || next.templateUrl == "/settings.html") {
        $('.page-home').removeClass('show-page');
        $('.page-article-content').addClass('show-page');
      }
    });
  });
});

webapp.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.items = [
      {title:'learn angular', done:true},
      {title:'build an angular app', done:false}];

  	$http.get('http://node-hnapi.herokuapp.com/news').success(function (data) {
        $scope.items = data;
  	});

    $scope.click = function() {

    };
  }]).
  controller('ContentCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    if ($routeParams.itemId) {
      $scope.itemId = $routeParams.itemId;
    }

    $http.get('http://node-hnapi.herokuapp.com/item/' + $routeParams.itemId).success(function (data) {
    	$scope.item = data;
    });
  }]).
  controller('SettingsCtrl', ['$scope', function ($scope) {
    console.log('Settings');
    $scope.title = "Settings";
  }]);

webapp.directive('item', ['$parse', function($parse) {
  return {
    restrict: 'A',
    template: '<a href="/item/{{item.id}}">{{item.title}}</a>',
    replace: false,
    link: function(scope, element, attrs, controller) {
      // link setTimeout(function, milliseconds);
    }
  };
}]);
