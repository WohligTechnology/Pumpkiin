// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angularPromiseButtons',
    'toastr',
    'ui.select'
]);

// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL

    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: tempateURL,
            controller: 'LoginCtrl'
        })
        .state('landing', {
            url: "/landing",
            templateUrl: tempateURL,
            controller: 'LandingCtrl'
        })
        .state('productdetailregistered', {
            url: "/productdetailregistered",
            templateUrl: tempateURL,
            controller: 'ProductDetailRegisteredCtrl'
        })
        .state('productdetailunregistered', {
            url: "/productdetailunregistered",
            templateUrl: tempateURL,
            controller: 'ProductDetailUnRegisteredCtrl'
        })
        .state('productregistration', {
            url: "/productregistration",
            templateUrl: tempateURL,
            controller: 'ProductRegistrationCtrl'
        })
        .state('links', {
            url: "/links",
            templateUrl: tempateURL,
            controller: 'LinksCtrl'
        });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});