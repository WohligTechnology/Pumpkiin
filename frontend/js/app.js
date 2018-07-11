// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload',
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
        .state('profile', {
            url: "/profile",
            templateUrl: tempateURL,
            controller: 'ProfileCtrl'
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
            url: "/productdetailregistered/:id",
            templateUrl: tempateURL,
            controller: 'ProductDetailRegisteredCtrl'
        })
        .state('productdetailunregistered', {
            url: "/productdetailunregistered",
            templateUrl: tempateURL,
            controller: 'ProductDetailUnregisteredCtrl'
        })
        .state('productregistration', {
            url: "/productregistration",
            templateUrl: tempateURL,
            controller: 'ProductRegistrationCtrl'
        })
        .state('productListing', {
            url: "/productListing",
            templateUrl: tempateURL,
            controller: 'ProductlistingCtrl'
        })
        .state('ticketcreation', {
            url: "/ticketcreation/:id",
            templateUrl: tempateURL,
            controller: 'TicketCreationCtrl'
        })
        .state('closedTicketcreation', {
            url: "/closedTicketcreation",
            templateUrl: tempateURL,
            controller: 'ClosedTicketcreationCtrl'
        })
        .state('openticket', {
            url: "/openticket",
            templateUrl: tempateURL,
            controller: 'OpenTicketCtrl'
        })
        .state('notification', {
            url: "/notification",
            templateUrl: tempateURL,
            controller: 'NotificationCtrl'
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