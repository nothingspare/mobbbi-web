app
    .factory('authInterceptor', function ($q, $window, UserService) {
        return {
            request: function (config) {
                if ($window.sessionStorage._auth && config.url.substring(0, 4) == 'http') {
                    config.params = {
                        'access-token': $window.sessionStorage._auth
                    };
                }
                UserService.initBgAndAvatar();
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    $window.location = '/';
                }
                return $q.reject(rejection);
            }
        };
    })
// Need set url REST Api in controller!
    .service('rest', function ($http, $location, $stateParams, API_URL) {

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
    })
    .factory('UserService', function ($rootScope, $window) {
        var currentUser;
        return {
            login: function (token) {
                $window.sessionStorage._auth = token;
            },
            logout: function () {
                $window.sessionStorage.removeItem('_auth');
            },
            isGuest: function(){
                if($window.sessionStorage._auth) return false;
                else return true;
            },
            setBg: function (bgUrl) {
                $rootScope.bgUrl = $window.sessionStorage.bgUrl = bgUrl;
            },
            setAvatar: function (avatarUrl) {
                $rootScope.avatarUrl = $window.sessionStorage.avatarUrl = avatarUrl;
            },
            initBgAndAvatar: function(){
                if ($window.sessionStorage.avatarUrl) $rootScope.avatarUrl = $window.sessionStorage.avatarUrl;
                if ($window.sessionStorage.bgUrl) $rootScope.bgUrl = $window.sessionStorage.bgUrl;
            },
            setIsSeller: function(value){
                $rootScope.isSeller = value;
            },
            setProfile: function(profile){
                $window.sessionStorage.facebookProfile = JSON.stringify(profile);
            },
            getProfile: function(){
                return JSON.parse($window.sessionStorage.facebookProfile);
            },
            currentUser: function () {
                return currentUser;
            }
        };
    });