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
        }).error(errorCallback);
    }])
    .controller('ItemGridIndex', ['$scope', 'rest', 'toaster', '$sce', 'status', '$filter', '$window', '$location', function($scope, rest, toaster, $sce, status, $filter, $window, $location) {

        $scope.pageClass = 'page-buyerprofile1';

        if (!$scope.items) {

            rest.path = 'v1/items';

            var errorCallback = function(data) {
                toaster.clear();
                toaster.pop('error', "status: " + data.status + " " + data.name, data.message);
            };

            rest.models().success(function(data) {
                $scope.items = data;
            }).error(errorCallback);

        }
    }]);