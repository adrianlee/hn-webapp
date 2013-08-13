'use strict';

var webapp = angular.module('hn', []);

webapp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {viewer: false});
    $routeProvider.when('/item/:itemId', {templateUrl: 'item.html', controller: 'ContentCtrl', viewer: true});
    $routeProvider.when('/settings', {templateUrl: 'settings.html', controller: 'SettingsCtrl', viewer: true});
    $routeProvider.when('/404', {templateUrl: '404.html', viewer: false});
    $routeProvider.otherwise({redirectTo: '/404'});
  }]);

webapp.config(['$locationProvider', function($location) {
    $location.html5Mode(true);
    $location.hashPrefix('!');
  }]);

webapp.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    console.log(current);
    console.log(next);

    if (typeof current == 'undefined') {
      if (next.viewer) {
        $('.page-home').removeClass('show-page');
        $('.page-article-content').addClass('show-page'); 
      } else {
        $('.page-home').addClass('show-page');
        $('.page-article-content').removeClass('show-page');
      }
      return;
    }

    if (current.viewer && !next.viewer) {
      $('.page-home').addClass('show-page');
      $('.page-article-content').removeClass('show-page');
    } else if (!current.viewer && next.viewer) {
      $('.page-home').removeClass('show-page');
      $('.page-article-content').addClass('show-page'); 
    }
  });
});

// Left Side
webapp.controller('HomeCtrl', ['$scope', '$http', 'CurrentItem', function ($scope, $http, CurrentItem) {
    $scope.items = [
      { title: 'learn angular', done: true },
      { title: 'build an angular app', done: false }
    ];

    $scope.items = [];

  	$http.get('http://node-hnapi.herokuapp.com/news').success(function (data) {
      $scope.items = data;
  	});

    $scope.CurrentItem = CurrentItem;
  }]);

// Right Side
webapp.controller('ContentCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
    if ($routeParams.itemId) {
      $scope.itemId = $routeParams.itemId;
    }

    $scope.item = CurrentItem.get();

    $http.get('http://node-hnapi.herokuapp.com/item/' + $routeParams.itemId).success(function (data) {
    	$scope.item = data;
    });
  }]);

// Settings
webapp.controller('SettingsCtrl', ['$scope', function ($scope) {
    console.log('Settings');
    $scope.title = "Settings";
  }]);

webapp.directive('item', [function() {
  return {
    restrict: 'A',
    template: '<a data-ng-click="$parent.CurrentItem.set(item);" data-ng-href="/item/{{item.id}}" data-ng-bind="item.title"></a>',
    replace: false,
    link: function(scope, element, attrs, controller) {
      // link setTimeout(function, milliseconds);
    }
  };
}]);

webapp.factory('CurrentItem', function() {
  var item = {};

  return {
    set: function (data) {
      console.log('set');
      item = data;
    },
    get: function () {
      console.log('get');
      return item;
    }
  }
});

webapp.factory('Screen', function() {
  return {};
});
