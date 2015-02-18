app
    .controller('ItemIndex', ['$scope', 'rest', 'toaster', '$sce', '$filter', '$window', function($scope, rest, toaster, $sce, $filter, $window) {

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
    .controller('ItemGridIndex', ['$scope', 'rest', 'toaster', '$sce', '$filter', function($scope, rest, toaster, $sce, $filter) {

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
    }])
    .controller('ItemView', ['$scope', 'rest', 'toaster', '$sce', '$filter', '$window', function($scope, rest, toaster, $sce, $filter, $window) {
        rest.path = 'v1/items';

        $scope.item = {};

        var errorCallback = function(data) {
            toaster.clear();
            if (data.status == undefined) {
                angular.forEach(data, function(error) {
                    toaster.pop('error', "Field: " + error.field, error.message);
                });
            }
            else {
                toaster.pop('error', "code: " + data.code + " " + data.name, data.message);
            }
        };

        rest.model().success(function(data) {
            $scope.item = data;
        }).error(errorCallback);
    }]);