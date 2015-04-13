var app = angular.module('myApp', ['ui.router', 'ngAnimate', 'toaster', 'ngSanitize', 'angular-carousel', 'satellizer', 'angularFileUpload', 'ngImgCrop', 'angular-loading-bar']);

app.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', '$httpProvider', '$authProvider', 'API_URL',
    function ($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL) {

        var modulesPath = '/modules';

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('main', {
            url: '/',
            controller: 'SiteLogin',
            templateUrl: modulesPath + '/site/views/main.html'
        });

        $stateProvider.state('sellorbuy', {
            url: '/sellorbuy',
            controller: 'SellOrBuy',
            templateUrl: modulesPath + '/site/views/sellorbuy.html'
        });

        $stateProvider.state('storeselect', {
            url: '/storeselect',
            controller: 'SiteStoreSelect',
            templateUrl: modulesPath + '/site/views/storeselect.html'
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
            url: API_URL + 'v1/user/auth'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('authInterceptor');
    }]);

app.constant('API_URL', 'http://api.instastore.us/');

app.factory('authInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            if ($window.sessionStorage._auth && config.url.substring(0, 4) == 'http') {
                config.params = {
                    'access-token': $window.sessionStorage._auth
                };
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $window.location = '/';
            }
            return $q.reject(rejection);
        }
    };
});

app.value('app-version', '0.2.0');

// Need set url REST Api in controller!
app.service('rest', function ($http, $location, $stateParams, API_URL) {

    return {

        baseUrl: API_URL,
        path: undefined,

        models: function () {
            return $http.get(this.baseUrl + this.path + location.search);
        },

        model: function () {
            if ($stateParams.expand != null) {
                return $http.get(this.baseUrl + this.path + "/" + $stateParams.id + '?expand=' + $stateParams.expand);
            }
            return $http.get(this.baseUrl + this.path + "/" + $stateParams.id);
        },

        get: function () {
            return $http.get(this.baseUrl + this.path);
        },

        postModel: function (model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function (model) {
            return $http.put(this.baseUrl + this.path + "/" + $stateParams.id, model);
        },

        deleteModel: function () {
            return $http.delete(this.baseUrl + this.path);
        }
    };

});

app
    .directive('login', ['$http', function ($http) {
        return {
            transclude: true,
            link: function (scope, element, attrs) {
                scope.isGuest = window.sessionStorage._auth == undefined;
            },

            template: '<a href="login" ng-if="isGuest">Login</a>'
        }
    }])
    .directive('imagesh', function ($q) {
        'use strict'

        var URL = window.URL || window.webkitURL;

        var getResizeArea = function () {
            var resizeAreaId = 'fileupload-resize-area';

            var resizeArea = document.getElementById(resizeAreaId);

            if (!resizeArea) {
                resizeArea = document.createElement('canvas');
                resizeArea.id = resizeAreaId;
                resizeArea.style.visibility = 'hidden';
                document.body.appendChild(resizeArea);
            }

            return resizeArea;
        }

        var resizeImage = function (origImage, options) {
            var maxHeight = options.resizeMaxHeight || 300;
            var maxWidth = options.resizeMaxWidth || 250;
            var quality = options.resizeQuality || 0.7;
            var type = options.resizeType || 'image/jpg';

            var canvas = getResizeArea();

            var height = origImage.height;
            var width = origImage.width;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            //draw image on canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(origImage, 0, 0, width, height);

            // get the data from canvas as 70% jpg (or specified type).
            return canvas.toDataURL(type, quality);
        };

        var createImage = function (url, callback) {
            var image = new Image();
            image.onload = function () {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };

        return {
            restrict: 'A',
            scope: {
                image: '=imagesh',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function (imageResult, callback) {
                    createImage(imageResult.url, function (image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function (imageResult) {
                    scope.$apply(function () {
                        //console.log(imageResult);
                        if (attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult;
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if (attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for (var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function (imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
        };
    })
    .directive('backgroundImage', function () {
        return function (scope, element, attrs) {
            restrict: 'A',
                attrs.$observe('backgroundImage', function (value) {
                    if (!value) value = 'img/background1-blur.jpg';
                    var style = "<style> html:before{background-image:url('" + value + "');}</style>";
                    element.append(style);
                });
        };
    })
    .directive('backgroundFilter', function () {
        return function (scope, element, attrs) {
            restrict: 'A',
                attrs.$observe('backgroundFilter', function (value) {
                    var style = "<style>" +
                        "html:before{" + value + ")}</style>"
                    element.append(style);
                });
        };
    })
    .filter('checkmark', function () {
        return function (input) {
            return input ? '✓' : '✘';
        };
    });
