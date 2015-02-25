app
    .controller('ProfileIndex', ['$scope', 'rest', 'toaster', '$sce', '$filter', function($scope, rest, toaster, $sce, $filter) {
        console.log('Profile Controller Initialized');
        $scope.slides = [
            {title: 'first'},
            {title: 'second'},
            {title: 'third'},
            {title: 'fourth'},
            {title: 'fifth'},
            {title: 'sixth'}
            ];
    }]);