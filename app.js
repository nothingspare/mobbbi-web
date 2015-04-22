var app = angular.module('myApp', ['ui.router', 'ngAnimate', 'toaster', 'ngSanitize', 'angular-carousel', 'satellizer', 'angularFileUpload', 'ngImgCrop', 'angular-loading-bar', 'ngDialog']);

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

        $stateProvider.state('accounts', {
            url: '/accounts',
            controller: 'StoreAccounts',
            templateUrl: modulesPath + '/store/views/accounts.html'
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

        $stateProvider.state('store', {
            url: '/store',
            controller: 'StoreIndex',
            templateUrl: modulesPath + '/store/views/index.html'
        });

        $authProvider.facebook({
            clientId: '352496064951251',
            url: API_URL + 'v1/user/auth'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('authInterceptor');
    }]);

app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
