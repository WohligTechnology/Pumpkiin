// JavaScript Document
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload',
    "ngMap",
    "internationalPhoneNumber",
    'ui.bootstrap',
    'ui.select',
    'ngAnimate',
    'toastr',
    'textAngular',
    'ngSanitize',
    'ngMap',
    'toggle-switch',
    'cfp.hotkeys',
    'ui.sortable'
]);

myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider

        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/template.html",
            controller: 'DashboardCtrl',
        })

        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })

        .state('page', {
            url: "/page/:id/{page:.*}/{keyword:.*}",
            templateUrl: "views/template.html",
            controller: 'PageJsonCtrl'
        })
        .state('productlist', {
            url: "/productlist",
            templateUrl: "views/template.html",
            controller: 'ProductlistCtrl'
        })
        .state('ticketlist', {
            url: "/ticketlist",
            templateUrl: "views/template.html",
            controller: 'TicketlistCtrl'
        })
        .state('ticketcreation', {
            url: "/ticketcreation",
            templateUrl: "views/template.html",
            controller: 'TicketcreationCtrl'
        })
        .state('loginapp', {
            url: "/login/:id",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })

        .state('country-list', {
            url: "/country-list/{page:.*}/{keyword:.*}",
            templateUrl: "views/template.html",
            controller: 'CountryCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcountry', {
            url: "/country-create",
            templateUrl: "views/template.html",
            controller: 'CreateCountryCtrl'
        })

        .state('editcountry', {
            url: "/country-edit/:id",
            templateUrl: "views/template.html",
            controller: 'EditCountryCtrl'
        })

        .state('schema-creator', {
            url: "/schema-creator",
            templateUrl: "views/template.html",
            controller: 'SchemaCreatorCtrl'
        })

        .state('excel-upload', {
            url: "/excel-upload/:model",
            templateUrl: "views/template.html",
            controller: 'ExcelUploadCtrl'
        })
        .state('userdetail', {
            templateUrl: "views/template.html",
            url: "/userdetail/:id/{page:.*}/{keyword:.*}",
            controller: 'UserDetailCtrl'
        })
        .state('viewproductpage', {
            templateUrl: "views/template.html",
            url: "/viewproductpage/:id/:status",
            controller: 'ViewProductPageCtrl'
        })
        .state('editproductpage', {
            templateUrl: "views/template.html",
            url: "/editproductpage/:id/{page:.*}/{keyword:.*}",
            controller: 'EditProductPageCtrl'
        })
        .state('createproductpage', {
            templateUrl: "views/template.html",
            url: "/createproductpage/:id",
            controller: 'CreateProductPageCtrl'
        })


        .state('jagz', {
            url: "/jagz",
            templateUrl: "views/jagz.html",
            controller: 'JagzCtrl'
        });

    $urlRouterProvider.otherwise("/dashboard");
    $locationProvider.html5Mode(isproduction);
});

myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});