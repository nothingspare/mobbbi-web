var app = angular.module('myApp', ['ui.router', 'ngAnimate', 'toaster', 'ngSanitize', 'angular-carousel', 'satellizer']);

app.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', '$httpProvider', '$authProvider', 'API_URL',
    function($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL) {

    var modulesPath = '/modules';

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('main', {
        url: '/',
        controller: 'SiteLogin',
        templateUrl: modulesPath + '/site/views/main.html'
    });
    $stateProvider.state('item', {
        url: '/item',
        controller: 'ItemIndex',
        templateUrl: modulesPath + '/item/views/index.html'
    });

    $stateProvider.state('itemview', {
        url: '/itemview/:id',
        controller: 'ItemView',
        templateUrl: modulesPath + '/item/views/view.html'
    });

    $stateProvider.state('profile', {
        url: '/profile',
        controller: 'ProfileIndex',
        templateUrl: modulesPath + '/profile/views/index.html'
    });

    $stateProvider.state('grid', {
        url: '/grid',
        controller: 'ItemGridIndex',
        templateUrl: modulesPath + '/item/views/item-grid.html'
    });

    $stateProvider.state('location', {
        url: '/location',
        controller: 'LocationIndex',
        templateUrl: modulesPath + '/location/views/index.html'
    });

    $authProvider.facebook({
        clientId: '352496064951251',
        url: API_URL + 'v1/user/auth',
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');
}]);

app.constant('API_URL', 'https://mobbbi-api-tairezzzz-1.c9.io/rest/web/');

app.factory('authInterceptor', function($q, $window) {
    return {
        request: function(config) {
            if ($window.sessionStorage._auth && config.url.substring(0, 4) == 'http') {
                config.params = {
                    'access-token': $window.sessionStorage._auth
                };
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                $window.location = '/';
            }
            return $q.reject(rejection);
        }
    };
});

app.value('app-version', '0.2.0');

// Need set url REST Api in controller!
app.service('rest', function($http, $location, $stateParams) {

    return {

        baseUrl: 'https://mobbbi-api-tairezzzz-1.c9.io/rest/web/',
        path: undefined,

        models: function() {
            return $http.get(this.baseUrl + this.path + location.search);
        },

        model: function() {
            if ($stateParams.expand != null) {
                return $http.get(this.baseUrl + this.path + "/" + $stateParams.id + '?expand=' + $stateParams.expand);
            }
            return $http.get(this.baseUrl + this.path + "/" + $stateParams.id);
        },

        get: function() {
            return $http.get(this.baseUrl + this.path);
        },

        postModel: function(model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function(model) {
            return $http.put(this.baseUrl + this.path + "/" + $stateParams.id, model);
        },

        deleteModel: function() {
            return $http.delete(this.baseUrl + this.path);
        }
    };

});

app
    .directive('login', ['$http', function($http) {
        return {
            transclude: true,
            link: function(scope, element, attrs) {
                scope.isGuest = window.sessionStorage._auth == undefined;
            },

            template: '<a href="login" ng-if="isGuest">Login</a>'
        }
    }])
    .filter('checkmark', function() {
        return function(input) {
            return input ? '✓' : '✘';
        };
    });
