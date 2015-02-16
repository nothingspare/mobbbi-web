app
    .controller('SiteLogin', ['$scope', 'rest', 'toaster', '$window', '$location', function($scope, rest, toaster, $window, $location) {

        if ($window.sessionStorage._auth) $location.path("/item");

        $scope.pageClass = 'page-enter1';

        rest.path = 'v1/user/login';

        var errorCallback = function(data) {
            toaster.clear();
            delete $window.sessionStorage._auth;
            angular.forEach(data, function(error) {
                toaster.pop('error', "Field: " + error.field, error.message);
            });
        };

        $scope.login = function() {
            rest.postModel($scope.model).success(function(data) {
                $window.sessionStorage._auth = data;
                toaster.pop('success', "Success");
                $location.path("/item");
            }).error(errorCallback);
        };
    }])
    .controller('SiteHeader', ['$scope', '$window', '$location', function($scope, $window, $location) {
        $scope.logout = function() {
            $window.sessionStorage.removeItem('_auth');
            $location.path("/");
        };
        
        $scope.profile = function(){
            $location.path("/profile");
        };
    }]);