'use strict';

var webapp = angular.module('bojap', []);

webapp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {viewer: false});
    $routeProvider.when('/profile/:itemId', {templateUrl: 'profile.html', controller: 'ProfileCtrl', viewer: true});
    $routeProvider.when('/user/:username', {templateUrl: 'user.html', controller: 'UserCtrl', viewer: true});
    $routeProvider.when('/settings', {templateUrl: 'settings.html', controller: 'SettingsCtrl', viewer: true});
    $routeProvider.when('/404', {templateUrl: '404.html', viewer: false});
    $routeProvider.otherwise({redirectTo: '/404'});
  }]);

webapp.config(['$locationProvider', function ($location) {
    // $location.html5Mode(true);
    $location.hashPrefix('!');
  }]);

webapp.config(['$httpProvider', function ($http){
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.common['Authorization'] = 'Basic anVuOjEyMw==';
    // $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('jun:123');
}]);

webapp.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    // console.log(current);
    // console.log(next);

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

    // $http.get('http://node-hnapi.herokuapp.com/news').success(function (data) {
  	$http.get('http://localhost:3000/v1/profiles').success(function (data) {
      $scope.items = data.payload;
  	});

    $scope.CurrentItem = CurrentItem;
  }]);

// Right Side
webapp.controller('ProfileCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
    if ($routeParams.itemId) {
      $scope.itemId = $routeParams.itemId;
    }

    $scope.item = CurrentItem.get();

    // $http.get('http://node-hnapi.herokuapp.com/item/' + $routeParams.itemId).success(function (data) {
    $http.get('http://localhost:3000/v1/profiles/' + $routeParams.itemId).success(function (data) {
    	$scope.item = data.payload;
    });
  }]);

webapp.controller('UserCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
    if ($routeParams.username) {
      $scope.username = $routeParams.username;
    }

    $scope.item = CurrentItem.get();

    // $http.get('http://node-hnapi.herokuapp.com/item/' + $routeParams.itemId).success(function (data) {
    $http.get('http://localhost:3000/v1/users/' + $routeParams.username).success(function (data) {
      $scope.item = data.payload;
    });
  }]);

// Settings
webapp.controller('SettingsCtrl', ['$scope', function ($scope) {
    console.log('Settings');
    $scope.title = "Settings";
  }]);

webapp.directive('item', [function () {
  return {
    restrict: 'A',
    template: '<a data-ng-click="$parent.CurrentItem.set(item);" data-ng-href="#!/profile/{{item._id}}" data-ng-bind="item.type"></a>',
    replace: false,
    link: function(scope, element, attrs, controller) {
      // link setTimeout(function, milliseconds);
    }
  };
}]);

webapp.factory('CurrentItem', function () {
  var item;

  return {
    set: function (data) {
      item = data;
    },
    get: function () {
      return item;
    }
  }
});

webapp.factory('Base64', [function () {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
          "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
          "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };
}]);
