app
    .controller('ItemIndex', ['$scope', 'rest', 'toaster', '$sce', '$filter', '$window', function ($scope, rest, toaster, $sce, $filter, $window) {

        $scope.pageClass = 'page-buyerprofile3';

        rest.path = 'v1/items';

        var errorCallback = function (data) {
            toaster.clear();
            toaster.pop('error', "status: " + data.status + " " + data.name, data.message);
        };

        rest.models().success(function (data) {
            $scope.items = data;
        }).error(errorCallback);
    }])
    .controller('ItemGridIndex', ['$scope', 'rest', 'toaster', '$sce', '$filter', function ($scope, rest, toaster, $sce, $filter) {

        $scope.pageClass = 'page-buyerprofile1';

        if (!$scope.items) {

            rest.path = 'v1/items';

            var errorCallback = function (data) {
                toaster.clear();
                toaster.pop('error', "status: " + data.status + " " + data.name, data.message);
            };

            rest.models().success(function (data) {
                $scope.items = data;
            }).error(errorCallback);

        }
    }])
    .controller('ItemView', ['$scope', 'rest', 'toaster', '$sce', '$filter', '$window',
        function ($scope, rest, toaster, $sce, $filter, $window) {

            rest.path = 'v1/items';

            $scope.item = {};

            var errorCallback = function (data) {
                toaster.clear();
                if (data.status == undefined) {
                    angular.forEach(data, function (error) {
                        toaster.pop('error', "Field: " + error.field, error.message);
                    });
                }
                else {
                    toaster.pop('error', "code: " + data.code + " " + data.name, data.message);
                }
            };

            rest.model().success(function (data) {
                $scope.item = data;
                $scope.slides = data.images;
            }).error(errorCallback);

            $scope.save = function () {
                rest.putModel($scope.item).success(function () {
                    toaster.pop('success', "Saved");
                }).error(errorCallback);
            };

            $scope.removeImage = function (thumb) {

                rest.path = 'v1/item-images/' + thumb.id;

                rest.deleteModel()
                    .success(function () {
                        var index = $scope.slides.indexOf(thumb);
                        $scope.slides.splice(index, 1);
                        toaster.pop('success', "Image deleted!");
                    })
                    .error(errorCallback);
            };
        }
    ])
    .controller('ItemViewTabsCtrl', ['$scope', function ($scope) {

        $scope.currentTab = 'modules/item/views/view-tab-comment.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function (tabUrl) {
            return tabUrl == $scope.currentTab;
        }
    }])
    .controller('ShrinkUploadImageCtrl', ['$scope', '$stateParams', '$upload', 'API_URL', 'toaster', function ($scope, $stateParams, $upload, API_URL, toaster) {

        var dataURItoBlob = function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };

        $scope.single = function(image){
            $scope.upload([dataURItoBlob(image.dataURL)]);
        };

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $upload.upload({
                        url: API_URL + 'v1/item/upload',
                        fields: {
                            'itemId': $stateParams.id
                        },
                        headers: {
                            'Content-Type': file.type
                        },
                        method: 'POST',
                        data: file,
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        toaster.pop('success', 'File ' + config.file.name + ' uploaded!');
                        $scope.slides.push({'image_url': data});
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        };
    }]);
