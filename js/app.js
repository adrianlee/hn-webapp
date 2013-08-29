'use strict';

var webapp = angular.module('bojap', []);

webapp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', { viewer: false });
    $routeProvider.when('/tutor/:itemId', {templateUrl: 'profile.html', controller: 'TutorProfileCtrl', viewer: true});
    $routeProvider.when('/student/:itemId', {templateUrl: 'profile.html', controller: 'StudentProfileCtrl', viewer: true});
    $routeProvider.when('/user/:username', {templateUrl: 'user.html', controller: 'UserCtrl', viewer: true});
    $routeProvider.when('/settings', {templateUrl: 'settings.html', controller: 'SettingsCtrl', viewer: true});
    $routeProvider.when('/404', {templateUrl: '404.html', viewer: false});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

webapp.config(['$locationProvider', function ($location) {
    // $location.html5Mode(true);
    $location.hashPrefix('!');
  }]);

webapp.config(['$httpProvider', function ($http) {
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.headers.common['Authorization'] = 'Basic anVuOjEyMw==';
    // $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('jun:123');
}]);

webapp.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $('#loading').hide();

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
webapp.controller('MainCtrl', ['$scope', 'screenService', function ($scope, screenService) {
  $scope.template = screenService.getScreen();

  $scope.menu = function (screen) {
    $('#loading').hide();
    $('.menu').addClass('hidden');
    screenService.setScreen(screen);
    $scope.template = screenService.getScreen();
  }
}]);

webapp.factory('screenService', [function() {
  var screens = {
    student: "students.html",
    tutor: "tutors.html",
    login: "login.html"
  };

  var currentScreen = screens.student;

  return {
    getScreen: function () {
      return currentScreen;
    },
    setScreen: function (screen) {
      currentScreen = screens[screen];
    }
  }
}]);

webapp.controller('LoginCtrl', ['$scope', '$http', 'Base64', function ($scope, $http, Base64) {
  $scope.input = {};

  $scope.submit = function (input) {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(input.username + ':' + input.password);
    $http.get('http://localhost:3000/v1/me').
      success(function (data) {
        // success
        console.log(data);
      }).
      error(function (data) {
        // error
        console.log(data);
      });
  };
}]);

webapp.controller('StudentCtrl', ['$scope', '$http', 'CurrentItem', function ($scope, $http, CurrentItem) {
  $scope.items = [
    { 
      "_creator": {
        "__v": 0,
        "_id": "521a60fcde8af2d3d8000001",
        "fullname": "Jun",
        "username":
        "jun",
        "_created":
        "2013-08-29T14:19:22.188Z"
      },
      "_id": "521bdf7b9c6875432c000002",
      "__v": 0,
      "_created": "2013-08-28T14:19:22.188Z",
      "title": "Looking for a Math Female Tutor near Tai Po",
      "location": "Tai Po",
      "duration": "4 hrs / wk",
      "price": 200,
      "subject": "DSE",
      "gender": "female",
      "grade": "Form 3",
      "tags": ["tag1", "tag2", "tag3"]
    },
    { 
      "_creator": {
        "__v": 0,
        "_id": "521a60fcde8af2d3d8000001",
        "fullname": "Jun",
        "username":
        "jun",
        "_created":
        "2013-08-29T14:19:22.188Z"
      },
      "_id": "521bdf7b9c6875432c000002",
      "__v": 0,
      "_created": "2013-08-29T14:19:22.188Z",
      "title": "Looking for a Math Female Tutor near Tai Po",
      "location": "Tai Po, New Territories",
      "duration": "4 times a week that is awesome",
      "price": 200,
      "subject": "DSE",
      "gender": "female",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ];
  $scope.type = "student";  // for directive studentItem link

  // $('#loading').show();

  // $http.get('http://localhost:3000/v1/students').
  //   success(function (data) {
  //     $('#loading').hide();
  //     $scope.items = data.payload;
  //   }).
  //   error(function (data) {
  //     console.log(data);
  //   });

  $scope.CurrentItem = CurrentItem;
}]);

webapp.controller('TutorCtrl', ['$scope', '$http', 'CurrentItem', function ($scope, $http, CurrentItem) {
  $scope.items = [];
  $scope.type = "tutor";  // for directive tutorItem link

  $('#loading').show();

  $http.get('http://localhost:3000/v1/tutors').
    success(function (data) {
      $('#loading').hide();
      $scope.items = data.payload;
    }).
    error(function (data) {
      console.log(data);
    });

  $scope.CurrentItem = CurrentItem;
}]);

// Right Side
webapp.controller('StudentProfileCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
  if ($routeParams.itemId) {
    $scope.itemId = $routeParams.itemId;
  }

  $scope.item = CurrentItem.get();

  $http.get('http://localhost:3000/v1/students/' + $routeParams.itemId).
    success(function (data) {
  	 $scope.item = data.payload;
    }).
    error(function (data) {
     console.log(data);
    });
}]);

webapp.controller('TutorProfileCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
  if ($routeParams.itemId) {
    console.log($routeParams.itemId);
    $scope.itemId = $routeParams.itemId;
  }

  $scope.item = CurrentItem.get();

  $http.get('http://localhost:3000/v1/tutors/' + $routeParams.itemId).
    success(function (data) {
      $scope.item = data.payload;
    }).
    error(function (data) {
      console.log(data);
    });
}]);

webapp.controller('UserCtrl', ['$scope', '$http', '$routeParams', 'CurrentItem', function ($scope, $http, $routeParams, CurrentItem) {
  if ($routeParams.username) {
    $scope.username = $routeParams.username;
  }

  $scope.item = CurrentItem.get();

  $http.get('http://localhost:3000/v1/users/' + $routeParams.username).
    success(function (data) {
      $scope.item = data.payload;
    }).
    error(function (data) {
      console.log(data);
    });
}]);

// Settings
webapp.controller('SettingsCtrl', ['$scope', function ($scope) {
  console.log('Settings');
  $scope.title = "Settings";
}]);

webapp.directive('studentItem', [function () {
  return {
    restrict: 'A',
    templateUrl: 'item.html',
    replace: false
  };
}]);

webapp.directive('tutorItem', [function () {
  return {
    restrict: 'A',
    templateUrl: 'item.html',
    replace: false
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

webapp.filter('moment', function () {
  return function (item) {
    return moment(item).fromNow();
  };
});
