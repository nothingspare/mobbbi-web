app
    .controller('ItemIndex', ['$scope', 'rest', 'toaster', '$sce', 'status', '$filter', '$window', '$location', function($scope, rest, toaster, $sce, status, $filter, $window, $location) {

        $scope.pageClass = 'page-buyerprofile3';
        
        rest.path = 'v1/items';

        var errorCallback = function(data) {
            toaster.clear();
            toaster.pop('error', "status: " + data.status + " " + data.name, data.message);
        };

        rest.models().success(function(data) {
            $scope.items = data;
            console.log($scope.items);
        }).error(errorCallback);

        $scope.logout = function() {
            $window.sessionStorage.removeItem('_auth');
            $location.path("/");
        };

    }]);