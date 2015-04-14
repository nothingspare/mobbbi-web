app
    .controller('SiteLogin', ['$scope', '$rootScope', 'rest', 'toaster', '$window', '$state', '$auth', function ($scope, $rootScope, rest, toaster, $window, $state, $auth) {
        if ($window.sessionStorage.avatarUrl) $rootScope.avatarUrl = $window.sessionStorage.avatarUrl;
        if ($window.sessionStorage.bgUrl) $rootScope.bgUrl = $window.sessionStorage.bgUrl;
        else $rootScope.bgUrl = "img/background1-blur.jpg";

        if ($window.sessionStorage._auth) $state.go('item');

        $scope.pageClass = 'page-enter1';

        rest.path = 'v1/user/login';

        var errorCallback = function (data) {
            toaster.clear();
            delete $window.sessionStorage._auth;
            angular.forEach(data, function (error) {
                toaster.pop('error', "Field: " + error.field, error.message);
            });
        };

        $scope.login = function () {

            rest.path = 'v1/user/login';

            if (!$scope.model) {
                toaster.pop('error', "Wrong login or password");
                return;
            }
            rest.postModel($scope.model).success(function (data) {
                $window.sessionStorage._auth = data;
                toaster.pop('success', "Success");
                $state.go('item');
            }).error(errorCallback);
        };

        $scope.authenticate = function (provider) {
            $auth.authenticate(provider).then(function (res) {
                $window.sessionStorage._auth = res.data.token;
                $rootScope.facebookProfile = res.data.profile;
                $rootScope.avatarUrl = res.data.store.avatar_url;
                $rootScope.bgUrl = res.data.store.bg_url;
                toaster.pop('success', "Welcome, " + res.data.profile.first_name + "!");
                $state.go('sellorbuy');
            }, handleError);
        };

        function handleError(err) {
            toaster.pop('error', err.data);
        }
    }])
    .controller('SiteHeader', ['$scope', '$window', '$state', 'ngDialog', function ($scope, $window, $state, ngDialog) {
        $scope.logout = function () {
            $window.sessionStorage.removeItem('_auth');
            $state.go("main");
        };

        $scope.profile = function () {
            $state.go("profile");
        };

        $scope.clickToOpen = function () {
            ngDialog.open({ template: 'modules/site/views/additem.html' });
        };

    }])
    .controller('SellOrBuy', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {

        $scope.goAsBuyer = function () {
            console.log('go as buyer');
            $rootScope.isSeller = false;
            $state.go('storeselect');
        };

        $scope.goAsSeller = function () {
            console.log('go as seller');
            $rootScope.isSeller = true;
            $state.go('storeselect');
        };

    }])
    .controller('SiteStoreSelect', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        if ($rootScope.isSeller) $state.go('item');
        $scope.selectStore = function(){
            $state.go('item');
        };
    }]);